/** Perfiles de las entrenadoras. Reemplazá los placeholders con datos confirmados. */
export interface CoachProfile {
  id: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  bio?: string;
  experience?: string[];
  teams?: string[];
  achievements?: string[];
  qualifications?: string[];
  placeholder?: boolean;
}

export const coaches: CoachProfile[] = [
  {
    id: 'entrenadora-1',
    name: 'Entrenadora 1',
    role: 'Entrenadora de Pura Potencia',
    photo: '/images/entrenadoras/sofi.webp',
    photoAlt: 'Entrenadora de Pura Potencia de pie en la cancha con una pelota',
    bio: 'Espacio para una presentación personal y su enfoque de trabajo. Reemplazar con información confirmada.',
    placeholder: true,
  },
  {
    id: 'entrenadora-2',
    name: 'Entrenadora 2',
    role: 'Entrenadora de Pura Potencia',
    photo: '/images/entrenadoras/entrenadora.webp',
    photoAlt: 'Entrenadora de Pura Potencia arrodillada en la cancha junto a una pelota',
    bio: 'Espacio para una presentación personal y su enfoque de trabajo. Reemplazar con información confirmada.',
    placeholder: true,
  },
];
