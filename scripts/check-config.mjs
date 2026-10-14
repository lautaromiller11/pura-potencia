// Se ejecuta antes del build (prebuild). Informa qué falta para publicar.
// Falla el build solo en PRODUCCIÓN de Vercel si falta SITE_URL, o con STRICT_BUILD=1.
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');

const env = process.env;
const has = (k) => Boolean(env[k]?.trim());
const isProd = env.VERCEL_ENV === 'production' || env.STRICT_BUILD === '1';

const problems = [];
const warnings = [];

if (!has('SITE_URL')) (isProd ? problems : warnings).push('SITE_URL vacío: el sitio se generará con noindex, sin canonical/sitemap/Open Graph absolutos.');
else if (!/^https:\/\/[^/\s]+$/.test(env.SITE_URL.trim().replace(/\/+$/, ''))) problems.push('SITE_URL debe ser una URL https sin ruta (ej. https://tu-dominio.com.ar).');

if (!has('WHATSAPP_NUMBER')) warnings.push('WHATSAPP_NUMBER vacío: no se mostrarán botones de WhatsApp.');

const line = '─'.repeat(60);
if (warnings.length || problems.length) {
  console.log(`\n${line}\n Pura Potencia · chequeo de configuración\n${line}`);
  warnings.forEach((w) => console.log(` ⚠  ${w}`));
  problems.forEach((p) => console.log(` ✖  ${p}`));
  console.log(`${line}\n`);
}
if (problems.length) process.exit(1);
