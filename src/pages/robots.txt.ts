import type { APIRoute } from 'astro';
import { SITE_URL, isIndexable } from '../config/site.ts';

export const prerender = true;

export const GET: APIRoute = () => {
  const lines = isIndexable
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`]
    : [
        '# Sitio sin dominio definitivo (SITE_URL) o en vista previa: no indexar.',
        'User-agent: *',
        'Allow: /',
      ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
