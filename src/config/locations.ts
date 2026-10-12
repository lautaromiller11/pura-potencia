export interface TrainingSchedule {
  days: string;
  time: string;
}

export interface TrainingLevel {
  label: string;
  schedules: TrainingSchedule[];
}

export interface TrainingVenue {
  id: string;
  name: string;
  address: string;
  locality: string;
  levels: TrainingLevel[];
  whatsappMessage: string;
  mapsUrl: string;
}

const mapsSearch = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const trainingVenues: TrainingVenue[] = [
  {
    id: 'martino-complejos',
    name: 'Martino Complejos',
    address: 'Corrientes 2066',
    locality: 'Rosario, Santa Fe',
    levels: [
      {
        label: 'Principiante',
        schedules: [
          { days: 'Martes y jueves', time: '19:00' },
          { days: 'Miércoles y viernes', time: '19:00' },
        ],
      },
      {
        label: 'Intermedio',
        schedules: [{ days: 'Lunes y miércoles', time: '20:00' }],
      },
    ],
    whatsappMessage: 'Hola, quería consultar por los entrenamientos de Pura Potencia en Martino Complejos.',
    mapsUrl: mapsSearch('Corrientes 2066, Rosario, Santa Fe, Argentina'),
  },
  {
    id: 'pichincha-point',
    name: 'Pichincha Point',
    address: 'Brown 3135',
    locality: 'Rosario, Santa Fe',
    levels: [
      {
        label: 'Principiante',
        schedules: [{ days: 'Martes y jueves', time: '19:00' }],
      },
    ],
    whatsappMessage: 'Hola, quería consultar por los entrenamientos de Pura Potencia en Pichincha Point.',
    mapsUrl: mapsSearch('Brown 3135, Rosario, Santa Fe, Argentina'),
  },
];

export const teamCoordinationMessage =
  'Hola, tengo un equipo y quería consultar cómo coordinar los entrenamientos.';
