/**
 * IMÁGENES DE LA WEB
 * ------------------------------------------------------------------
 * Cada ranura apunta a un archivo dentro de `src/assets/photos/`.
 * - `file: null`  → se muestra un placeholder decorativo (no es una foto real).
 * - `file: 'nombre.jpg'` → se optimiza automáticamente (AVIF/WebP, responsive).
 *
 * IMPORTANTE: al cargar una foto real, revisá el `alt` para que describa
 * lo que realmente muestra la imagen (quiénes, qué hacen, dónde).
 * Guía completa en docs/ASSETS.md.
 */

export interface PhotoSlot {
  /** Nombre del archivo en src/assets/photos/ (ej. 'hero-equipo-sonriendo.jpg') o null. */
  file: string | null;
  /** Texto alternativo. Se usa solo cuando hay foto. Ajustarlo a la imagen real. */
  alt: string;
  /** Nombre de archivo sugerido (se muestra solo en desarrollo). */
  suggested: string;
}

export const photos = {
  hero: {
    file: 'hero-equipo.jpg',
    alt: 'El equipo femenino de Pura Potencia posando en la cancha',
    suggested: 'hero-equipo.jpg (horizontal o vertical, mín. 1600 px de ancho)',
  },
  aboutMain: {
    file: 'escuela-equipo.jpg',
    alt: 'Las jugadoras de Pura Potencia celebran un campeonato',
    suggested: 'escuela-entrenamiento.jpg',
  },
  aboutSecondary: {
    file: 'escuela-jugadoras.jpg',
    alt: 'Jugadoras de Pura Potencia reunidas en la cancha',
    suggested: 'escuela-jugadoras.jpg',
  },
  community: {
    file: 'comunidad-trofeo.jpg',
    alt: 'Una jugadora de Pura Potencia con su trofeo',
    suggested: 'comunidad-equipo.jpg',
  },
} satisfies Record<string, PhotoSlot>;

/**
 * Galería editorial. `size` define cómo ocupa el espacio en pantallas grandes:
 * 'tall' (vertical), 'wide' (horizontal), 'square' (cuadrada).
 */
export interface GallerySlot extends PhotoSlot {
  size: 'tall' | 'wide' | 'square';
}

export const gallery: GallerySlot[] = [
  { file: 'galeria-01-equipo.jpg', size: 'square', alt: 'El equipo posa después de un partido nocturno', suggested: 'galeria-01-equipo.jpg' },
  { file: 'galeria-02-equipo.jpg', size: 'square', alt: 'Jugadoras de Pura Potencia reunidas en la cancha', suggested: 'galeria-02-equipo.jpg' },
  { file: 'galeria-03-festejo.jpg', size: 'wide', alt: 'El equipo festeja con humo verde y celeste', suggested: 'galeria-03-festejo.jpg' },
  { file: 'galeria-04-equipo-verde.jpg', size: 'square', alt: 'El equipo de Pura Potencia posa con su camiseta verde en la cancha', suggested: 'galeria-04-equipo-verde.jpg' },
  { file: 'galeria-05-charla-tactica.png', size: 'square', alt: 'Una entrenadora y sus jugadoras observan una pizarra táctica en la cancha', suggested: 'galeria-05-charla-tactica.png' },
  { file: 'galeria-06-partido.jpg', size: 'square', alt: 'Dos jugadoras disputan una pelota frente al arco durante un partido', suggested: 'galeria-06-partido.jpg' },
];
