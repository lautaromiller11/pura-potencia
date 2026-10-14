# Pura Potencia — Escuela de Fútbol Femenino · Rosario

Landing page estática (Astro + TypeScript) con sedes y horarios publicados, contacto por WhatsApp y formulario que prepara el mensaje para enviarlo por WhatsApp, preparada para SEO local.

> **Estado:** antes de publicar, completá la configuración de correo, dominio y fotos reales, y volvé a confirmar la disponibilidad de los horarios publicados. Ver [§9 Antes de publicar](#9-antes-de-publicar-tareas-del-propietario).

---

## 1. Arquitectura

| Capa | Decisión | Motivo |
|---|---|---|
| Framework | **Astro 7** + TypeScript estricto | HTML estático, casi sin JavaScript en el cliente, buen SEO y rendimiento |
| Estilos | CSS moderno (variables, grid, `clamp`) sin librerías | Cero dependencias de UI, CSS de ~12 KB |
| Tipografías | `@fontsource` (Barlow Condensed + Inter), autohospedadas | Sin pedidos a terceros |
| Imágenes | `astro:assets` (`<Picture>`: AVIF + WebP, `srcset`, lazy) | Optimización automática al cargar fotos |
| Formulario | Validación en navegador y apertura de WhatsApp con la consulta completa | La persona confirma el envío desde WhatsApp |
| Despliegue | GitHub Pages estático o adaptador `@astrojs/vercel` | Sin endpoint de correo |

No hay base de datos, autenticación ni CMS. El formulario abre WhatsApp con el mensaje preparado; la persona debe confirmar el envío desde WhatsApp.

### Estructura

```
src/
  config/
    school.ts      ← datos generales de la escuela y mensaje de WhatsApp
    locations.ts   ← sedes, direcciones, grupos y horarios publicados
    partners.ts    ← alianzas y mensajes de consulta
    images.ts      ← ranuras de fotos (editar al cargar fotos)
    site.ts        ← dominio, WhatsApp, SEO, navegación (lee variables de entorno)
  components/      ← Header, Hero, About, Training, Community, Partnerships, Gallery, Contact(Form), Footer, Photo, Logo
  layouts/Base.astro   ← <head>: SEO, Open Graph, canonical, JSON-LD
  lib/
    validation.ts       ← validación/normalización del formulario
  pages/
    index.astro
    robots.txt.ts, sitemap.xml.ts  ← se generan con el dominio canónico
  styles/global.css, assets/photos/
public/             ← favicon.svg, og-default.png, brand/
scripts/            ← check-config.mjs (prebuild), make-og.mjs
tests/              ← pruebas unitarias del formulario
docs/ASSETS.md      ← guía de fotos, logo, favicon y OG
```

---

## 2. Requisitos e instalación

- **Node.js ≥ 22.12** y npm.

```bash
npm install
cp .env.example .env     # completar (ver §4). En local se puede dejar vacío
npm run dev              # http://localhost:4321
```

## 3. Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (los placeholders muestran el nombre de archivo sugerido) |
| `npm test` | Pruebas unitarias de validación y normalización |
| `npm run check` | Chequeo de tipos de TypeScript/Astro |
| `npm run build` | Chequeo de configuración (`prebuild`) + `astro check` + build de producción |
| `npm run preview` | Vista previa del build |
| `npm run make-og` | Regenera la imagen social provisoria |

El *prebuild* (`scripts/check-config.mjs`) imprime si falta configurar `SITE_URL` o `WHATSAPP_NUMBER`.

---

## 4. Variables de entorno

Todas están documentadas en `.env.example` (sin valores reales). **Nunca** subas `.env` al repositorio (ya está en `.gitignore`).

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `SITE_URL` | Build | URL canónica definitiva (`https://…`, sin barra final). Define canonical, Open Graph, `sitemap.xml`, `robots.txt` y JSON-LD. **Si está vacía, el sitio se genera con `noindex`** y no se publica una URL de sitemap provisoria |
| `WHATSAPP_NUMBER` | Build | Solo dígitos con código de país (Argentina móvil: `549` + área sin 0 + número sin 15). Vacía = no se muestran botones de WhatsApp |
El formulario valida los campos y prepara un mensaje con nombre, correo, teléfono (si se completó), motivo y consulta. Al tocar «Enviar consulta» se abre WhatsApp; la persona puede revisar y enviar el mensaje desde allí.

---

## 5. Formulario de contacto

El formulario no envía ni almacena datos en el sitio. Tras validar los campos, abre WhatsApp con la consulta cargada; el envío se completa cuando la persona toca «Enviar» en WhatsApp.

---

## 6. Despliegue en Vercel

1. Subí el proyecto a un repositorio (GitHub, GitLab o Bitbucket).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importá el repositorio. Vercel detecta Astro automáticamente (comando: `npm run build`).
3. En **Settings → Environment Variables** cargá `SITE_URL` y `WHATSAPP_NUMBER` para **Production**.
4. **Deploy**. Los despliegues de vista previa (*Preview*) salen automáticamente con `noindex`.
5. Abrí el sitio y probá el formulario de punta a punta.

*Netlify:* es posible reemplazando `@astrojs/vercel` por `@astrojs/netlify` en `astro.config.mjs` (y moviendo las cabeceras de `vercel.json` a un archivo `_headers`). No se probó en este proyecto.

---

## 7. Dominio propio

El dominio **todavía no está registrado** y no se afirma que ninguno esté disponible. Opciones a evaluar: `purapotencia.com.ar`, `purapotenciafutbol.com.ar`, `potenciafutbolfem.com.ar` (solo ideas).

1. **Disponibilidad y registro:** los `.com.ar` se gestionan en [nic.ar](https://nic.ar) (NIC Argentina). Buscá el nombre, y registralo a nombre de la persona o entidad titular (suele requerir identificarse con CUIT/CUIL; verificá los pasos y costos vigentes allí). También podés usar un registrador comercial para otros TLD (`.com`, `.ar`).
2. **Elegir una URL canónica única:** por ejemplo `https://purapotencia.com.ar` (sin `www`) o con `www`. Elegí una sola y usá esa en `SITE_URL`.
3. **Conectarlo a Vercel:** *Project → Settings → Domains → Add*. Vercel muestra los registros DNS exactos (A/CNAME) para cargar en el panel de NIC Argentina o del proveedor de DNS que uses. Usá **los valores que Vercel muestre**.
4. **Redirigir la variante:** agregá también la otra variante (`www` ↔ sin `www`) y marcala como **redirección (308)** hacia la canónica.
5. **HTTPS:** Vercel emite y renueva el certificado automáticamente cuando el DNS propaga (puede tardar desde minutos hasta horas).
6. **Actualizar `SITE_URL`** con el dominio definitivo y volver a desplegar. Verificá `/robots.txt`, `/sitemap.xml`, el `<link rel="canonical">` y que ya no figure `noindex`.

---

## 8. SEO

Ya implementado:

- `<title>`: «Escuela de Fútbol Femenino en Rosario | Pura Potencia» y meta descripción (editables en `src/config/site.ts`).
- Un único `<h1>`, jerarquía de encabezados, anclas descriptivas, `lang="es-AR"`.
- Canonical, Open Graph y Twitter Card configurables (requieren `SITE_URL`).
- `robots.txt` y `sitemap.xml` generados con el dominio canónico; `robots` con `noindex` automático mientras no haya dominio definitivo o en vistas previas.
- **JSON-LD** como `SportsOrganization`, con nombre, URL, Instagram, logo y zona de servicio (Rosario, Santa Fe), solo cuando hay dominio canónico. La dirección se añade únicamente si se confirma como dirección pública de la organización. Las sedes de entrenamiento externas no se modelan automáticamente como sucursales. **No** incluye reseñas, valoraciones, precios, coordenadas ni horarios.
- Contenido con variaciones naturales (escuela de fútbol femenino en Rosario, clases y entrenamientos de fútbol femenino, escuela de fútbol para mujeres…). Sin relleno para buscadores.

**Para que cuente el SEO local, completá en `src/config/school.ts`** (solo lo que la escuela confirme): sede/dirección, días y horarios, categorías y edades, etc. Cuanto más concreta y verdadera sea la información, mejor responde a lo que la gente busca.

### Google Search Console

1. Entrá a [search.google.com/search-console](https://search.google.com/search-console) → **Agregar propiedad**.
2. Recomendado: propiedad de **Dominio** y verificación con un registro **TXT** en el DNS. Alternativa: propiedad de **prefijo de URL** con etiqueta HTML o archivo.
3. En **Sitemaps** enviá `sitemap.xml` (queda `https://tu-dominio/sitemap.xml`).
4. Con **Inspección de URL** podés pedir la indexación de la portada.
5. Revisá más adelante *Rendimiento* (consultas reales) y *Páginas* (errores de indexación).

La indexación y las posiciones dependen de Google y llevan tiempo: **no se pueden garantizar resultados específicos**.

### Perfil de Empresa de Google (Google Business Profile)

Conviene **evaluarlo, no darlo por hecho**. Google permite perfiles para negocios que atienden personas en un lugar físico o que van al lugar del cliente (zona de servicio), con información real y verificable. Si la escuela entrena en una sede concreta y atiende a las jugadoras allí, puede ser útil para aparecer en el mapa y en búsquedas locales. Antes, leé los requisitos y políticas vigentes de Google, usá solo datos reales (nombre, categoría, dirección o zona, horarios, teléfono, enlace a esta web) y mantené la coherencia con lo publicado en el sitio. No crees un perfil con una dirección que no corresponda.

---

## 9. Antes de publicar (tareas del propietario)

**Datos y contenido**
- [ ] **Dominio**: elegir, registrar, conectar a Vercel y cargar `SITE_URL` (§7).
- [x] **WhatsApp**: número confirmado y configurado en local. Para producción, cargar `WHATSAPP_NUMBER` en el hosting.
- [ ] **Fotos reales** (hero, escuela, comunidad, 6 de galería) y sus textos alternativos (`src/config/images.ts`, ver `docs/ASSETS.md`). Mientras tanto se ven placeholders decorativos.
- [x] **Logo y favicon** (`public/brand/`, `public/favicon.svg`).
- [ ] **Imagen social** `public/og-default.png`: reemplazar la provisoria.
- [x] **Sedes y horarios publicados** (`src/config/locations.ts`): la disponibilidad y vigencia de los horarios se deben confirmar antes de asistir. Actualizá esa configuración central si cambian.
- [ ] **Disponibilidad y condiciones de inscripción**: confirmar con la escuela antes de publicar mensajes de cupos o vacantes.
- [x] **Alianza Healthy Tortitas** (`src/config/partners.ts`): descripción confirmada; no se publican descuentos, condiciones ni enlaces no verificados.
- [ ] Revisar los textos y horarios con la escuela periódicamente; la web no afirma que la disponibilidad esté vigente.
- [ ] Probar el formulario en producción y confirmar que WhatsApp abre con los datos esperados.
- [ ] Configurar Google Search Console y enviar el sitemap (§8). Evaluar Perfil de Empresa de Google.

---

## 10. Qué se verificó realmente (y qué no)

**Verificado en este entorno**
- Estos resultados corresponden a una revisión anterior; hay que volver a ejecutar las verificaciones después de los cambios actuales.
- Navegador (Chromium, móvil 375 px y escritorio 1440 px): sin desbordes horizontales ni errores de consola; menú móvil por teclado (abre con Enter, cierra con Esc y devuelve el foco); errores de validación visibles, con foco en el primer campo inválido y `aria-invalid`; navegación por anclas; con `prefers-reduced-motion: reduce` el contenido aparece sin animación.
- **Lighthouse (mediciones previas, build estático con placeholders, 2 corridas):** móvil Rendimiento 99 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 (LCP ≈ 1,5–2,0 s, TBT 0 ms, CLS 0); escritorio 100 · 100 · 100 · 100 (LCP 0,5 s, CLS 0,001). No se reejecutó Lighthouse en la auditoría actual; hay que volver a medir al cargar fotos reales y antes de publicar.
- HTML generado: un solo `<h1>`, metadatos, canonical, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml` coherentes con `SITE_URL` (probado con un dominio ficticio solo para la verificación, no queda en el código).
- Contraste de la paleta calculado: todos los textos pequeños ≥ 4,5:1 (el verde claro sobre verde profundo, 3,66:1, solo se usa en texto grande).

**No verificado (requiere configuración del propietario)**
- Comportamiento del formulario en producción: confirmar que WhatsApp abre con los datos esperados.
- Despliegue en Vercel y comportamiento del rate limit/headers en producción.
- Dominio, DNS, HTTPS y Search Console.
- Aspecto con fotos y logo reales.

**Nota sobre dependencias:** `npm audit` informa una vulnerabilidad de severidad alta en `path-to-regexp` (ReDoS), dependencia transitiva de `@astrojs/vercel` → `@vercel/routing-utils`. Según el árbol de dependencias la usa el adaptador al generar la configuración durante el build, no el código del sitio. La «corrección» automática que propone npm es **bajar a una versión mayor anterior del adaptador**, incompatible con Astro 7, por eso no se aplicó. Conviene revisar `npm audit` y actualizar el adaptador cuando salga una versión corregida.
