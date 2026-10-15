# Cómo actualizar los perfiles de las entrenadoras

Los perfiles están centralizados en `src/config/coaches.ts`. Reemplazá las dos entradas identificadas como ejemplo con nombres, roles, presentación y trayectoria confirmados. Los campos de experiencia, equipos, logros y formación son opcionales; agregá solo información verificada. Los logros se muestran como logros de los equipos para no atribuirlos individualmente sin confirmación.

Guardá las fotografías originales optimizadas para web en `public/images/entrenadoras/` y usá una ruta desde la raíz en `photo`, por ejemplo `/images/entrenadoras/nombre.webp`. Completá `photoAlt` describiendo la imagen. Si se omite `photo`, se muestra un placeholder de cancha que indica dónde agregarla.

Ejemplo de perfil:

```ts
{
  id: 'entrenadora-nombre',
  name: 'Nombre Apellido',
  role: 'Entrenadora',
  photo: '/images/entrenadoras/nombre.webp',
  photoAlt: 'Nombre Apellido en una cancha de fútbol',
  bio: 'Presentación breve aprobada por la entrenadora.',
  experience: ['Experiencia confirmada'],
  teams: ['Equipo confirmado'],
  achievements: ['Logro del equipo y año confirmado'],
  qualifications: ['Formación o certificación confirmada'],
}
```
