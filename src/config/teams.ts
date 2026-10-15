/**
 * Equipos que entrenan en las canchas vinculadas a Pura Potencia.
 * Reemplazá estas entradas de ejemplo cuando tengas información confirmada.
 * Las rutas de imagen se resuelven desde /public (por ejemplo: /images/equipos/equipo.jpg).
 */
export interface TrainingTeam {
  id: string;
  name: string;
  image?: string;
  description: string;
  since?: string;
  achievements?: string[];
  alt?: string;
  isExample?: boolean;
}

export const trainingTeams: TrainingTeam[] = [
  {
    id: 'equipo-malbec-ejemplo-1',
    name: 'Equipo Malbec',
    image: '/images/equipos/equipo-malbec-1.webp',
    alt: 'Foto de ejemplo de un equipo femenino posando frente al arco con camisetas bordó',
    description: 'Ejemplo ficticio: un equipo que comparte la pasión por el fútbol y el compañerismo dentro y fuera de la cancha.',
    since: '2023',
    achievements: ['Campeonas de la Copa de Verano 2024'],
    isExample: true,
  },
  {
    id: 'equipo-malbec-ejemplo-2',
    name: 'Equipo Malbec',
    image: '/images/equipos/equipo-malbec-2.webp',
    alt: 'Foto de ejemplo de un plantel femenino con camisetas azul oscuro delante del arco',
    description: 'Ejemplo ficticio: un grupo que disfruta entrenar, compartir partidos y seguir creciendo en equipo.',
    since: '2022',
    achievements: ['Finalistas de la Copa de Invierno 2023'],
    isExample: true,
  },
  {
    id: 'equipo-malbec-ejemplo-3',
    name: 'Equipo Malbec',
    image: '/images/equipos/equipo-malbec-3.webp',
    alt: 'Foto de ejemplo de un equipo femenino con camisetas violetas y bordó en la cancha',
    description: 'Ejemplo ficticio: la historia de un equipo unido por las ganas de jugar y acompañarse.',
    since: '2024',
    achievements: ['Campeonas del Torneo de Primavera 2024'],
    isExample: true,
  },
];
