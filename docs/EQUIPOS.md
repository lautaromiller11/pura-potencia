# Cómo agregar un equipo

Los datos de la sección **Entrenan con nosotras** están en `src/config/teams.ts`. Las tarjetas con `isExample: true` aparecen marcadas como contenido ficticio y no representan equipos reales; reemplazalas o eliminá esas entradas antes de publicar información definitiva.

Para sumar un equipo, agregá un objeto a `trainingTeams` con `id` único, `name` y `description`. Podés incluir `since` (año o fecha confirmada), `achievements` (lista de logros confirmados), `image` y `alt` descriptivo.

Colocá las fotos autorizadas en `public/images/equipos/` y usá una ruta desde la raíz, por ejemplo:

```ts
{
  id: 'equipo-nombre',
  name: 'Nombre del equipo',
  image: '/images/equipos/nombre.jpg',
  alt: 'El equipo Nombre posando en la cancha después de un partido',
  description: 'Breve historia del equipo.',
  since: '2023',
  achievements: ['Campeonas de ...'],
}
```

Usá imágenes apaisadas con proporción 4:3 y dimensiones web razonables. Si `image` no está definido, se muestra un placeholder sin provocar una solicitud de archivo. Omití `since` o `achievements` cuando no haya información confirmada; no se renderizan bloques vacíos.
