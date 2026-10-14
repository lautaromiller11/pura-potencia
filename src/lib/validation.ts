/**
 * Validación y normalización del formulario de contacto.
 * Módulo puro (sin dependencias): se usa en el navegador (feedback inmediato)
 * y en el servidor (la validación que realmente cuenta).
 */

export const REASONS = [
  { value: 'entrenamientos', label: 'Información sobre entrenamientos' },
  { value: 'inscripcion', label: 'Inscripción' },
  { value: 'otra', label: 'Otra consulta' },
] as const;

export type ReasonValue = (typeof REASONS)[number]['value'];

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  phoneMin: 6,
  phoneMax: 30,
  messageMin: 10,
  messageMax: 2000,
} as const;

export type FieldName = 'name' | 'email' | 'phone' | 'reason' | 'message';
export type FieldErrors = Partial<Record<FieldName, string>>;

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}

export interface ValidContact {
  name: string;
  email: string;
  phone: string | null;
  reason: ReasonValue | null;
  message: string;
}

// Caracteres de control (salvo \n y \t) y marcas de dirección Unicode.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‎‏‪-‮⁦-⁩]/g;

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const singleLine = (value: unknown): string =>
  asString(value).normalize('NFC').replace(CONTROL_CHARS, '').replace(/\s+/g, ' ').trim();

const multiLine = (value: unknown): string =>
  asString(value)
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/** Convierte cualquier entrada desconocida en un ContactInput normalizado. */
export function normalize(raw: unknown): ContactInput {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    name: singleLine(data.name),
    email: singleLine(data.email).toLowerCase(),
    phone: singleLine(data.phone),
    reason: singleLine(data.reason),
    message: multiLine(data.message),
  };
}

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]+$/;

export const MESSAGES = {
  nameRequired: 'Ingresá tu nombre y apellido.',
  nameShort: `El nombre es demasiado corto (mínimo ${LIMITS.nameMin} caracteres).`,
  nameLong: `El nombre es demasiado largo (máximo ${LIMITS.nameMax} caracteres).`,
  emailRequired: 'Ingresá tu correo electrónico.',
  emailInvalid: 'Revisá el correo: tiene que tener el formato nombre@dominio.com.',
  phoneInvalid: 'Revisá el teléfono: usá solo números, espacios, + y guiones.',
  reasonInvalid: 'Elegí una de las opciones de la lista.',
  messageRequired: 'Escribí tu consulta.',
  messageShort: `Contanos un poco más (mínimo ${LIMITS.messageMin} caracteres).`,
  messageLong: `El mensaje es demasiado largo (máximo ${LIMITS.messageMax} caracteres).`,
} as const;

export type ValidationResult =
  | { ok: true; data: ValidContact }
  | { ok: false; errors: FieldErrors };

export function validate(input: ContactInput): ValidationResult {
  const errors: FieldErrors = {};

  if (!input.name) errors.name = MESSAGES.nameRequired;
  else if (input.name.length < LIMITS.nameMin) errors.name = MESSAGES.nameShort;
  else if (input.name.length > LIMITS.nameMax) errors.name = MESSAGES.nameLong;

  if (!input.email) errors.email = MESSAGES.emailRequired;
  else if (input.email.length > LIMITS.emailMax || !EMAIL_RE.test(input.email)) {
    errors.email = MESSAGES.emailInvalid;
  }

  if (input.phone) {
    const digits = input.phone.replace(/\D/g, '');
    if (
      !PHONE_RE.test(input.phone) ||
      input.phone.length > LIMITS.phoneMax ||
      digits.length < LIMITS.phoneMin
    ) {
      errors.phone = MESSAGES.phoneInvalid;
    }
  }

  if (input.reason && !REASONS.some((r) => r.value === input.reason)) {
    errors.reason = MESSAGES.reasonInvalid;
  }

  if (!input.message) errors.message = MESSAGES.messageRequired;
  else if (input.message.length < LIMITS.messageMin) errors.message = MESSAGES.messageShort;
  else if (input.message.length > LIMITS.messageMax) errors.message = MESSAGES.messageLong;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      reason: (input.reason as ReasonValue) || null,
      message: input.message,
    },
  };
}

export const reasonLabel = (value: ReasonValue | null): string =>
  REASONS.find((r) => r.value === value)?.label ?? 'Sin especificar';
