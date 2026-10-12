/**
 * CONFIGURACIÓN DE DESPLIEGUE (se lee de variables de entorno en el build).
 * El dominio definitivo se define únicamente con SITE_URL.
 */
import { school } from './school.ts';

const env = process.env;
const clean = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/** URL canónica definitiva (sin barra final) o null si todavía no se definió. */
export const SITE_URL: string | null = clean(env.SITE_URL)?.replace(/\/+$/, '') ?? null;

/**
 * El sitio solo se declara indexable cuando hay dominio definitivo y NO es un
 * deploy de vista previa (preview) de Vercel. En cualquier otro caso se envía
 * "noindex" para no indexar URLs provisorias.
 */
const isPreviewDeploy = Boolean(env.VERCEL_ENV) && env.VERCEL_ENV !== 'production';
export const isIndexable: boolean = Boolean(SITE_URL) && !isPreviewDeploy;

/** WhatsApp: se publica solo si hay un número válido (8 a 15 dígitos). */
const waDigits = clean(env.WHATSAPP_NUMBER)?.replace(/\D/g, '') ?? '';
export const whatsappUrlFor = (message = school.whatsappMessage): string | null =>
  waDigits.length >= 8 && waDigits.length <= 15
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`
    : null;
export const whatsappUrl: string | null = whatsappUrlFor();

export const social = {
  instagramUrl: school.instagram.url,
  instagramHandle: school.instagram.handle,
};

/** Textos SEO. */
export const seo = {
  title: 'Escuela de Fútbol Femenino en Rosario | Pura Potencia',
  description:
    'Entrenamientos de fútbol femenino en Rosario. Conocé nuestras sedes en Martino Complejos y Pichincha Point, consultá los horarios publicados y escribinos.',
  locale: 'es-AR',
  /** Imagen social (1200×630). Reemplazable: ver docs/ASSETS.md */
  ogImagePath: '/og-default.png',
  ogImageAlt: 'Pura Potencia — Escuela de Fútbol Femenino en Rosario',
};

/** Navegación principal por anclas. */
export const nav = [
  { href: '#escuela', label: 'La escuela' },
  { href: '#entrenamientos', label: 'Entrenamientos' },
  { href: '#comunidad', label: 'Comunidad' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Contacto' },
] as const;

/** Construye una URL absoluta con el dominio canónico (o relativa si no hay). */
export const absoluteUrl = (path = '/'): string => `${SITE_URL ?? ''}${path}`;
