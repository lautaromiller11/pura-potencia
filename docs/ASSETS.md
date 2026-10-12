# Guía de imágenes y marca

Todo lo visual que falta está preparado como **ranura reemplazable**. Mientras una ranura no tenga archivo, la web muestra un placeholder decorativo (cancha estilizada, sin texto y oculto para lectores de pantalla). **No son fotos reales del club** y no deben presentarse como tales: cargá las fotos reales antes de publicar.

## 1. Fotografías

1. Copiá la foto en `src/assets/photos/` (JPG, PNG, WebP o AVIF).
2. Abrí `src/config/images.ts` y poné el nombre del archivo en `file`.
3. Ajustá el `alt` para que describa lo que la foto muestra realmente.

Astro genera automáticamente AVIF + WebP en varios tamaños, con `srcset`, `width/height` (sin saltos de diseño) y carga diferida. La foto del hero se carga con prioridad alta.

| Ranura (`images.ts`) | Dónde aparece | Sugerencia |
|---|---|---|
| `hero` | Portada, a gran escala | Equipo o entrenamiento. Mín. 1600 px de ancho. Se recorta a 4:5 en escritorio y 4:3 en móvil: dejá aire alrededor de las personas |
| `aboutMain`, `aboutSecondary` | «Conocé Pura Potencia» | Entrenamiento y jugadoras (vertical + cuadrada) |
| `community` | «Una escuela para formar parte» | Equipo reunido, celebración (vertical) |
| `gallery[0..5]` | Galería | Mezcla de entrenamientos, equipos, partidos, celebraciones y camisetas. `size` define si es vertical, horizontal o cuadrada |

Agregar o quitar fotos de la galería: editá el arreglo `gallery` (cada elemento es una ranura).

**Buenas prácticas**
- Subí originales de buena calidad (≈1600–2400 px en el lado largo); la web los optimiza. No hace falta comprimirlos antes.
- Usá nombres descriptivos en minúscula y con guiones: `galeria-03-equipo-categoria-a.jpg`.
- Usá solo fotos propias o con autorización de las personas que aparecen (especialmente de menores) y de quien las tomó. No se descargan ni reutilizan automáticamente imágenes de Instagram.
- Texto alternativo: describí la escena en una frase corta («Jugadoras celebrando un gol en la cancha»). Evitá «foto de…» y no repitas keywords.

## 2. Logo

Las versiones optimizadas se sirven desde `public/brand/logo.webp` (transparente, texto verde para fondos claros) y `public/brand/logo-white.webp` (transparente, texto blanco para fondos oscuros). Los PNG originales de alta resolución se conservan en `src/assets/brand/originals/`; no se publican directamente. `src/components/Logo.astro` usa el logo en el pie y en páginas internas; el navbar muestra el nombre en texto. El logo de Healthy Tortitas está en `public/brand/healthy-tortitas.webp` y se presenta en la sección de alianzas. Para reemplazar los logos, guardá las versiones optimizadas bajo `public/brand/` y conservá las variantes de color para mantener el contraste.

## 3. Favicon

`public/favicon.svg` ya muestra el nombre de Pura Potencia en un SVG cuadrado de 64×64. Para que la tipografía se vea idéntica en todos los dispositivos, cuando haya un original vectorial conviene convertir las letras a trazados. Opcional: sumá `favicon.ico` y `apple-touch-icon.png` (180×180) en `public/` y referencialos en `src/layouts/Base.astro`.

## 4. Imagen para redes sociales (Open Graph)

`public/og-default.png` (1200×630) es una imagen **provisoria solo tipográfica**, generada con `npm run make-og`. Reemplazala por una foto/arte real con el **mismo nombre de archivo** (o cambiá `seo.ogImagePath` en `src/config/site.ts`). Dejá el texto importante en el centro: cada red recorta distinto.

Después de publicar, podés comprobar la vista previa con el depurador de compartir de cada red (Facebook Sharing Debugger, LinkedIn Post Inspector, etc.). Las redes guardan en caché la imagen anterior.

## 5. Paleta y tipografía

Definidas como variables CSS al inicio de `src/styles/global.css`. Son los valores aproximados indicados: verde salvia `#71947D`, verde profundo `#155E50`, crema `#F3EBD7`, negro verdoso `#111815`, verde claro `#A7B8A9`. Si el logo original usa otros valores, cambiá solo ahí. Verificá el contraste si modificás colores (el verde salvia y el verde claro **no** alcanzan para texto chico sobre crema o verde profundo).

Tipografías (autohospedadas, sin llamadas a Google Fonts): Barlow Condensed (titulares) e Inter (texto).
