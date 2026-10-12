import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site.ts';
import { privacyIsComplete } from '../config/school.ts';

export const prerender = true;

/**
 * Sitemap con las páginas públicas indexables. Usa siempre el dominio canónico (SITE_URL).
 * La política de privacidad se incluye solo cuando está completa (si no, va con noindex).
 */
export const GET: APIRoute = () => {
  if (!SITE_URL) {
    // Sin dominio definitivo no se publican URLs provisorias.
    return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n', {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
  const paths = ['/', ...(privacyIsComplete ? ['/politica-de-privacidad'] : [])];
  const urls = paths.map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
