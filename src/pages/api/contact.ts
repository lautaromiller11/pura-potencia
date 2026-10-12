import type { APIRoute } from 'astro';
import {
  MAX_BODY_BYTES,
  createRateLimiter,
  processContact,
  type ServiceResult,
} from '../../lib/contact-service.ts';

// Única ruta que se ejecuta en servidor (función serverless). El resto es estático.
const staticPages = process.env.DEPLOY_TARGET === 'github-pages';
export const prerender = staticPages;

// En el despliegue estático esta página solo genera una respuesta informativa;
// el formulario deriva a WhatsApp porque GitHub Pages no ejecuta endpoints POST.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, message: 'Enviá tu consulta por WhatsApp.' }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const limiter = createRateLimiter(5, 10 * 60 * 1000);

const json = (result: ServiceResult, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

const fail = (status: number, message: string) => json({ status, body: { ok: false, message } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Solo se acepta el formulario del propio sitio (mismo origen).
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return fail(403, 'Solicitud no permitida.');
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return fail(415, 'Formato no soportado.');
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail(400, 'No pudimos leer la solicitud.');
  }
  if (raw.length > MAX_BODY_BYTES) return fail(413, 'El mensaje es demasiado largo.');

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail(400, 'No pudimos leer la solicitud.');
  }

  let ip = 'unknown';
  try {
    ip = clientAddress || ip;
  } catch {
    /* sin IP disponible: se agrupa bajo "unknown" */
  }

  const result = await processContact({
    payload,
    ip,
    // Las claves se leen en el servidor, en tiempo de ejecución. Nunca llegan al cliente.
    env: {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
      CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    },
    limiter,
    log: (message, detail) => console.error(`[contact] ${message}`, detail ?? ''),
  });

  return json(result, result.status === 429 ? { 'Retry-After': '600' } : {});
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, message: 'Método no permitido.' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json; charset=utf-8' },
  });
