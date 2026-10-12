export interface TrainingGroup {
  label: string;
  days: string;
  time: string;
}

export interface TrainingVenue {
  id: string;
  name: string;
  address: string;
  locality: string;
  groups: TrainingGroup[];
  whatsappMessage: string;
  mapsUrl: string;
}

const mapsSearch = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const trainingVenues: TrainingVenue[] = [
  {
    id: 'nexo-sports',
    name: 'Nexo Sports',
    address: 'Corrientes 2066',
    locality: 'Rosario, Santa Fe',
    groups: [
      { label: 'Grupo 1', days: 'Lunes y miércoles', time: '19:00–20:00' },
      { label: 'Grupo 2', days: 'Martes y jueves', time: '19:00–20:00' },
    ],
    whatsappMessage: 'Hola, quería consultar por los entrenamientos de Pura Potencia en Nexo Sports.',
    mapsUrl: mapsSearch('Corrientes 2066, Rosario, Santa Fe, Argentina'),
  },
  {
    id: 'pichincha-point',
    name: 'Pichincha Point',
    address: 'Brown 3135',
    locality: 'Rosario, Santa Fe',
    groups: [
      { label: 'Grupo 3', days: 'Martes y jueves', time: '19:00–20:00' },
    ],
    whatsappMessage: 'Hola, quería consultar por los entrenamientos de Pura Potencia en Pichincha Point.',
    mapsUrl: mapsSearch('Brown 3135, Rosario, Santa Fe, Argentina'),
  },
];

export const teamCoordinationMessage =
  'Hola, tengo un equipo y quería consultar cómo coordinar los entrenamientos.';
