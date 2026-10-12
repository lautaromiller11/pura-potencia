export interface Partner {
  name: string;
  description: string;
  whatsappMessage: string;
  logo: string;
  instagramUrl: string;
}

export const partners: Partner[] = [
  {
    name: 'Healthy Tortitas',
    description: 'Una propuesta aliada de Pura Potencia que ofrece un beneficio exclusivo para el equipo.',
    whatsappMessage: 'Hola, quería consultar por el beneficio de Healthy Tortitas para el equipo de Pura Potencia.',
    logo: '/brand/healthy-tortitas.webp',
    instagramUrl: 'https://www.instagram.com/healthytortitas/',
  },
];
