/**
 * DATOS EDITABLES DE LA ESCUELA
 * ------------------------------------------------------------------
 * Todo lo que figura como `null` está PENDIENTE de confirmar por la escuela.
 * Mientras sea `null`, la web NO inventa nada: invita a consultar por
 * formulario / WhatsApp. Al completar un dato, aparece solo en la web
 * (sección Entrenamientos, footer, JSON-LD y política de privacidad).
 *
 * Los datos sensibles al despliegue (dominio, WhatsApp, correos) viven en
 * variables de entorno: ver src/config/site.ts y .env.example.
 */

export interface SchoolConfig {
  /** Nombre comercial que se muestra en la web. */
  name: string;
  /** Nombre del perfil de Instagram, usado como título descriptivo. */
  fullName: string;
  /** Razón social / nombre legal. Pendiente: confirmar con la escuela. */
  legalName: string | null;
  city: string;
  region: string;
  country: 'AR';
  instagram: { url: string; handle: string };
  /**
   * Dirección de la sede. Completar SOLO si la escuela confirma que quiere
   * publicarla. `openToPublic` indica si es un lugar al que el público puede ir.
   */
  address: {
    street: string;
    locality: string;
    postalCode?: string;
    openToPublic: boolean;
  } | null;
  /** Información de entrenamientos. Cada campo es texto libre listo para mostrar. */
  training: {
    venue: string | null; // Sede
    schedule: string | null; // Días y horarios
    categories: string | null; // Categorías y edades
    levels: string | null; // Niveles de experiencia
    format: string | null; // Modalidad
    fees: string | null; // Cuotas e inscripción
  };
  /** Datos para la política de privacidad. Pendiente: confirmar con la escuela. */
  privacy: {
    controller: string | null; // Nombre / razón social del responsable
    controllerTaxId: string | null; // CUIT/CUIL u otro identificador, si corresponde
    contactEmail: string | null; // Correo para ejercer derechos
    retention: string | null; // Plazo de conservación de las consultas
    lastUpdated: string | null; // Fecha, por ejemplo "12 de octubre de 2026"
  };
  /** Texto prellenado del primer mensaje de WhatsApp. */
  whatsappMessage: string;
}

export const school: SchoolConfig = {
  name: 'Pura Potencia',
  fullName: 'Pura Potencia - Escuela de Fútbol Femenino Rosario',
  legalName: null,
  city: 'Rosario',
  region: 'Santa Fe',
  country: 'AR',
  instagram: {
    url: 'https://www.instagram.com/potenciafutbolfem/',
    handle: '@potenciafutbolfem',
  },
  address: null,
  training: {
    venue: null,
    schedule: null,
    categories: null,
    levels: null,
    format: null,
    fees: null,
  },
  privacy: {
    controller: null,
    controllerTaxId: null,
    contactEmail: null,
    retention: null,
    lastUpdated: null,
  },
  whatsappMessage: 'Hola! Quiero consultar por los entrenamientos de Pura Potencia.',
};

/** True cuando la política de privacidad tiene los datos mínimos completos. */
export const privacyIsComplete = Boolean(
  school.privacy.controller && school.privacy.contactEmail && school.privacy.lastUpdated,
);
