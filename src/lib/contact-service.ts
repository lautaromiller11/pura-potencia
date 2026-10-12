/**
 * Lógica del envío de consultas (independiente del framework, para poder testearla).
 * El endpoint src/pages/api/contact.ts solo adapta Request/Response a esta función.
 *
 * Reglas de oro:
 *  - Nunca se informa éxito si Resend no aceptó el envío.
 *  - Los errores hacia el cliente son genéricos (el detalle va solo al log del servidor).
 *  - No se guarda nada: el mensaje solo viaja por correo.
 */
import { normalize, validate, reasonLabel, type FieldErrors, type ValidContact } from './validation.ts';

export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

export interface ServiceResult {
  status: number;
  body: { ok: boolean; message?: string; errors?: FieldErrors };
}

export const MIN_FILL_MS = 2000; // un humano no completa el formulario en menos de 2 s
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
export const MAX_BODY_BYTES = 10_000;
const RESEND_URL = 'https://api.resend.com/emails';
const RESEND_TIMEOUT_MS = 8000;

/* ── Limitador de frecuencia en memoria ─────────────────────────────
 * Es "de mejor esfuerzo": en serverless cada instancia tiene su memoria.
 * Para un límite global estricto, usar el firewall de Vercel/Netlify o Upstash
 * (ver README). Aun así frena ráfagas desde una misma instancia. */
export interface RateLimiter {
  hit(key: string, now?: number): boolean; // true = permitido
}

export function createRateLimiter(max = 5, windowMs = 10 * 60 * 1000): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return true;
    },
  };
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const stripHeaderChars = (value: string): string => value.replace(/[\r\n]+/g, ' ');

export function buildEmail(data: ValidContact) {
  const reason = reasonLabel(data.reason);
  const subject = stripHeaderChars(`Nueva consulta web (${reason}) — ${data.name}`).slice(0, 150);
  const text = [
    'Nueva consulta desde la web de Pura Potencia',
    '',
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Teléfono / WhatsApp: ${data.phone ?? 'No indicó'}`,
    `Motivo: ${reason}`,
    '',
    'Mensaje:',
    data.message,
    '',
    '— Podés responder a este correo: la respuesta va directo a la persona que consultó.',
  ].join('\n');
  const html = `<!doctype html><html lang="es-AR"><body style="font-family:Arial,sans-serif;color:#111815;line-height:1.5">
<h2 style="margin:0 0 12px">Nueva consulta desde la web de Pura Potencia</h2>
<table cellpadding="4" style="border-collapse:collapse">
<tr><td><strong>Nombre</strong></td><td>${escapeHtml(data.name)}</td></tr>
<tr><td><strong>Correo</strong></td><td>${escapeHtml(data.email)}</td></tr>
<tr><td><strong>Teléfono / WhatsApp</strong></td><td>${escapeHtml(data.phone ?? 'No indicó')}</td></tr>
<tr><td><strong>Motivo</strong></td><td>${escapeHtml(reason)}</td></tr>
</table>
<p style="margin:16px 0 4px"><strong>Mensaje</strong></p>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
<p style="color:#555;font-size:12px;margin-top:20px">Podés responder a este correo: la respuesta va directo a la persona que consultó.</p>
</body></html>`;
  return { subject, text, html };
}

export interface ProcessArgs {
  payload: unknown;
  ip: string;
  env: ContactEnv;
  limiter: RateLimiter;
  fetchImpl?: typeof fetch;
  now?: number;
  log?: (message: string, detail?: unknown) => void;
}

const GENERIC_ERROR =
  'No pudimos enviar tu consulta en este momento. Probá de nuevo en unos minutos o escribinos por WhatsApp o Instagram.';

export async function processContact(args: ProcessArgs): Promise<ServiceResult> {
  const { payload, ip, env, limiter, fetchImpl = fetch, now = Date.now(), log = () => {} } = args;
  const input = normalize(payload);

  // 1) Honeypot: los bots completan el campo oculto. Respondemos "ok" sin enviar nada.
  if (input.website) return { status: 200, body: { ok: true } };

  // 2) Tiempo mínimo de completado.
  const age = now - input.startedAt;
  if (!input.startedAt || age < MIN_FILL_MS || age > MAX_FORM_AGE_MS) {
    const message =
      age > MAX_FORM_AGE_MS
        ? 'El formulario venció. Recargá la página y volvé a enviarlo.'
        : 'Esperá un instante y volvé a enviar el formulario.';
    return { status: 400, body: { ok: false, message } };
  }

  // 3) Validación de servidor.
  const result = validate(input);
  if (!result.ok) {
    return {
      status: 422,
      body: { ok: false, message: 'Revisá los campos marcados.', errors: result.errors },
    };
  }

  // 4) Límite de frecuencia por IP.
  if (!limiter.hit(ip, now)) {
    return {
      status: 429,
      body: { ok: false, message: 'Enviaste varias consultas seguidas. Esperá unos minutos e intentá de nuevo.' },
    };
  }

  // 5) Configuración del proveedor: si falta, NO se simula el envío.
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) {
    log('Formulario sin configurar: faltan RESEND_API_KEY, CONTACT_TO_EMAIL o CONTACT_FROM_EMAIL.');
    return {
      status: 503,
      body: { ok: false, message: 'El formulario todavía no está disponible. Escribinos por WhatsApp o Instagram.' },
    };
  }

  // 6) Envío real con Resend. Éxito solo si el proveedor lo acepta y devuelve un id.
  const email = buildEmail(result.data);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: result.data.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
      signal: controller.signal,
    });
    const json = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!response.ok || !json?.id) {
      log(`Resend rechazó el envío (HTTP ${response.status}).`, json?.message);
      return { status: 502, body: { ok: false, message: GENERIC_ERROR } };
    }
    return { status: 200, body: { ok: true, message: '¡Gracias! Recibimos tu consulta.' } };
  } catch (error) {
    log('Falló la llamada a Resend.', error instanceof Error ? error.name : error);
    return { status: 502, body: { ok: false, message: GENERIC_ERROR } };
  } finally {
    clearTimeout(timer);
  }
}
