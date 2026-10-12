// Genera public/og-default.png (1200×630): imagen social PROVISORIA, solo tipográfica.
// Reemplazala por una foto/arte real con el mismo nombre. Uso: node scripts/make-og.mjs
import sharp from 'sharp';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#155E50"/>
  <g opacity=".12">${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 160}" y="0" width="80" height="630" fill="#111815"/>`).join('')}</g>
  <circle cx="1010" cy="315" r="200" fill="none" stroke="#A7B8A9" stroke-width="6" opacity=".45"/>
  <rect x="80" y="130" width="90" height="12" fill="#F3EBD7"/>
  <text x="80" y="215" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="34" letter-spacing="6" fill="#A7B8A9">ESCUELA DE FÚTBOL FEMENINO · ROSARIO</text>
  <text x="80" y="400" font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="190" fill="#F3EBD7">PURA</text>
  <text x="80" y="560" font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="190" fill="#F3EBD7">POTENCIA</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(new URL('../public/og-default.png', import.meta.url).pathname);
console.log('OK → public/og-default.png');
