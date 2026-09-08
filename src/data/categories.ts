/**
 * categories.ts — Definición de las categorías del portafolio.
 *
 * El Home muestra una card viewport-size por cada categoría. Cada proyecto
 * en projects.ts declara su `categoryId`, y la CategoryPage filtra los
 * proyectos por ese id para mostrar el carrusel interno de esa categoría.
 *
 * Colores de acento tomados del sistema visual del site — Trenza Dorada
 * y Mercado del Agua — para mantener coherencia cromática interna.
 */

export type CategoryId = 'datos' | 'ux-ui' | 'editorial';

export type Category = {
  id: CategoryId;
  /** Etiqueta larga: header de la vista de categoría y card del home. */
  label: string;
  /** Etiqueta corta: eyebrow y navbar. */
  labelShort: string;
  /** Descripción una línea que aparece dentro de la vista de categoría. */
  description: string;
  /** Color de acento — usado en el círculo geométrico de la card y detalles UI. */
  accentColor: string;
};

export const categories: Category[] = [
  {
    id: 'ux-ui',
    label: 'UX-UI',
    labelShort: 'UX-UI',
    description:
      'Arquitectura de información, sitemaps, sistemas de diseño y flujos para producto digital.',
    accentColor: '#5f8f5f', // verde para producto centrado en persona
  },
  {
    id: 'datos',
    label: 'Visualización de datos',
    labelShort: 'Datos',
    description:
      'Del cruce de bases públicas a piezas de exposición. Datos como material narrativo.',
    accentColor: '#3d5b8a', // azul de datos (convención dataviz)
  },
  {
    id: 'editorial',
    label: 'Editorial',
    labelShort: 'Editorial',
    description:
      'Libros, ebooks y piezas gráficas donde la tipografía y la retícula son el proyecto.',
    accentColor: '#c9955b', // dorado del sistema — coherente con papel/impresión
  },
];

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find(c => c.id === id);
}
