/**
 * projects.ts — Contenido único de todos los proyectos del portafolio.
 *
 * Editar aquí para agregar / modificar proyectos. Home.tsx (carrusel) y
 * ProjectDetail.tsx (página de detalle) leen desde este mismo archivo, así
 * que no hay contenido incrustado en los componentes.
 *
 * Convenciones:
 *   - Etapa con `figureKey` renderiza un componente custom (SVG, diagrama)
 *     desde el FIGURE_REGISTRY de ProjectDetail — tiene prioridad sobre image.
 *   - Etapa con `video` renderiza <video> autoplay muted loop.
 *   - Etapa con `image` (y sin figureKey/video) renderiza foto en layout 2-col.
 *   - Etapa sin ninguno de los tres → placeholder tenue.
 *   - `variant: 'quote'` presenta el texto en itálica editorial (cita/cierre).
 */

// El Mercado del Agua — 6 fotos de la exposición.
// Cada foto se usa exactamente una vez: 5 dentro de las etapas + foto-3 como
// thumbnail exclusivo del carrusel (transición metafórica del disco).
import mdaMesa from '@/assets/mercado-del-agua/foto-1-mesa.jpg';
import mdaDiscoVerde from '@/assets/mercado-del-agua/foto-2-disco-verde.jpg';
import mdaDiscoManchas from '@/assets/mercado-del-agua/foto-3-disco-manchas.jpg';
import mdaSalaRojo from '@/assets/mercado-del-agua/foto-4-sala-disco-rojo.jpg';
import mdaDiscoRojoCerca from '@/assets/mercado-del-agua/foto-6-disco-rojo-cerca.jpg';
import mdaVisualizacion from '@/assets/mercado-del-agua/mercado-visualizacion.png';
import mdaPipeline from '@/assets/mercado-del-agua/mercado-pipeline.png';

// Censo 2024 (Globallys / INE) — 3 propuestas de infografía "Resultados Generales"
import censoPropuesta1 from '@/assets/censo/propuesta-1.png';
import censoPropuesta2 from '@/assets/censo/propuesta-2.png';
import censoPropuesta3 from '@/assets/censo/propuesta-3.png';

// Labosfera (Taller Data UDP, nov 2024) — 6 láminas cuadradas + 1 video en
// /public/labosfera-instalacion.mp4 (thumbnail del carrusel, no de una etapa).
import labosferaPregunta from '@/assets/labosfera/pregunta.png';
import labosferaMetodo from '@/assets/labosfera/metodo.png';
import labosferaDatos from '@/assets/labosfera/datos.png';
import labosferaEsfera from '@/assets/labosfera/esfera.png';
import labosferaMueble from '@/assets/labosfera/mueble.png';
import labosferaPipeline from '@/assets/labosfera/pipeline.png';

// Sitemap INE (Globallys / INE, 2025). Assets:
//   - kit-1 objetivo (portrait)     — etapa 1
//   - benchmark tabla regional      — etapa 2 (screenshot del xlsx)
//   - sitemap-tree ultra-wide       — etapa 3 (3850×1038, aspect 3.71)
//   - kit-3 reglas (portrait)       — etapa 4
//   - kit-5 WCAG (portrait)         — etapa 5
//   - mockup live-site              — etapa 6 (screenshot censo2024.ine.gob.cl)
// kit-2 y kit-4 quedaron sin usar tras el reemplazo de etapa 2/6 — el
// benchmark real y el mockup renderean mejor que las páginas del PDF.
import sitemapKit1 from '@/assets/sitemap-ine/kit-1.png';
import sitemapKit3 from '@/assets/sitemap-ine/kit-3.png';
import sitemapKit5 from '@/assets/sitemap-ine/kit-5.png';
import sitemapTree from '@/assets/sitemap-ine/sitemap-tree.jpg';
import sitemapBenchmark from '@/assets/sitemap-ine/benchmark.png';
import sitemapMockup from '@/assets/sitemap-ine/mockup.png';

import edubigThumb from '@/imports/edubig/portada.png';
import tuxpanThumb from '@/assets/tuxpan/tuxpan-thumb.png';

import type { CategoryId } from '@/data/categories';

export type StageVariant = 'photo' | 'quote';

/**
 * Clave de figura custom (registrada en ProjectDetail.tsx → FIGURE_REGISTRY).
 * Cuando está seteada, tiene prioridad sobre `image` y se renderiza un
 * componente React (ej. un gráfico SVG editorial) en el hueco de la figura.
 */
export type FigureKey = 'mda-data-bar';

export type Stage = {
  id: number;
  label: string;
  text: string;
  /** Ruta de imagen (importada con Vite). Si se omite, el layout es centrado. */
  image?: string;
  /**
   * Ruta de video (URL pública, ej. '/foo.mp4' → /public/foo.mp4). Cuando está
   * presente, tiene prioridad sobre `image` — se renderiza un <video> en loop
   * mudo dentro del contenedor de figura (usa `image` como poster si existe).
   * Combinar con `figureAspect` para que el marco calce con la proporción real.
   */
  video?: string;
  /** Pie de foto opcional (solo se muestra si hay imagen). */
  imageCaption?: string;
  /** Componente-figura custom por clave (gráficos SVG, diagramas). Tiene prioridad sobre `image`. */
  figureKey?: FigureKey;
  /**
   * Aspecto (width / height) del contenedor de figura. Default 1.6 (736×460).
   * Tres bandas en ProjectDetail.getFigureDimensions():
   *   >= 1.4 → landscape (736 de ancho)
   *   0.85 – 1.4 → cuadrado (560 de ancho)
   *   < 0.85 → portrait (520 de ancho)
   * Setear al aspect real de la imagen para que object-cover no recorte nada.
   */
  figureAspect?: number;
  /** Presentación tipográfica del texto sin imagen. Default 'photo' (párrafo). */
  variant?: StageVariant;
  /**
   * Enlace externo mostrado bajo el texto de la etapa. Útil para vincular a
   * archivos, sitios en producción o fuentes referenciadas en la etapa
   * (ej. un benchmark en Google Sheets, el sitio implementado del cliente).
   */
  link?: { url: string; label?: string };
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  year: string;
  /** Subtítulo por proyecto — aparece en la card del carrusel bajo el título. */
  category: string;
  /** Categoría del portafolio a la que pertenece el proyecto (para filtrado). */
  categoryId: CategoryId;
  /** Bajada corta que aparece en la card del carrusel. */
  description: string;
  /** Si false, la card aparece como "En preparación" y no es navegable. */
  available: boolean;
  /** Thumbnail para la card del carrusel. Si se omite, la card muestra placeholder. */
  thumbnail?: string;
  /**
   * Video en loop (mudo, autoplay) para la card del carrusel. Si está presente,
   * tiene prioridad sobre `thumbnail` — el video se renderiza y `thumbnail`
   * queda como poster/fallback mientras carga. Referenciar por ruta pública
   * (ej. '/mi-video.mp4' → archivo en /public/mi-video.mp4).
   */
  thumbnailVideo?: string;
  /** Ajuste del thumbnail en la card: 'cover' (llena, recorta) por defecto,
   *  o 'contain' (calza completo sin recortar, útil para mockups). */
  thumbnailFit?: 'cover' | 'contain';
  /** Etiqueta en el encabezado del detalle: "Proyecto 01", "Proyecto 02"… */
  headerLabel: string;
  stages: Stage[];
};

export const projects: Project[] = [
  // ────────────────────────────────────────────────────────────────────────
  // 01 · Labosfera — proyecto colaborativo del Taller Data UDP (nov 2024).
  //      Sistema visual de nubes de puntos sobre 30 años de egresados del
  //      Diseño UDP + instalación física con botonera Arduino. Autores:
  //      Matías Cáceres, María Caro, Valentina Cooper, Benjamín Ramírez y
  //      Tomás Zambrano — se presenta como personal siguiendo la misma
  //      política que El Mercado del Agua.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    slug: 'labosfera',
    title: 'Labosfera',
    year: '2024',
    category: 'Visualización de datos + Instalación interactiva',
    categoryId: 'datos',
    description:
      'Sistema visual de nubes de puntos sobre las tendencias laborales del diseñador UDP a lo largo de tres décadas.',
    available: true,
    thumbnail: labosferaEsfera,
    thumbnailVideo: '/labosfera-instalacion.mp4',
    headerLabel: 'Proyecto 01',
    stages: [
      {
        id: 1,
        label: 'Etapa 1 — Pregunta',
        text:
          '¿Cómo han impactado los ciclos estudiantiles y el contexto nacional-universitario histórico en las tendencias laborales del diseñador UDP? Proyecto colaborativo del Taller Data de la Universidad Diego Portales que estudia cómo los ritmos internos de la escuela — cambios de malla, hitos institucionales, transformaciones del país — moldean las trayectorias profesionales de sus egresados.',
        image: labosferaPregunta,
        imageCaption: 'Pregunta guía del proyecto sobre la fachada de la sede FAAD-UDP.',
        figureAspect: 1,
      },
      {
        id: 2,
        label: 'Etapa 2 — Método',
        text:
          'Cuatro pasos: cifras de matriculados y titulados 1995-2024 vía la plataforma MI FUTURO del MINEDUC y bases internas de la escuela; búsqueda de egresados por periodos quinquenales usando LinkedIn como fuente auxiliar; tendencias laborales relevadas por encuesta directa; hitos históricos investigados vía Google. Un dataset propio construido por triangulación de fuentes.',
        image: labosferaMetodo,
        imageCaption: 'Cuatro pasos metodológicos del levantamiento de datos.',
        figureAspect: 1,
      },
      {
        id: 3,
        label: 'Etapa 3 — Los datos',
        text:
          'El dataset se divide en tres partes: cifras de la escuela (30 registros anuales), egresados (266 individuos categorizados como gráficos, industriales, empleados o emprendedores), y áreas de trabajo con hitos históricos. Cada periodo quinquenal se ancla en un evento contextual — apertura de la Biblioteca de Santiago, gratuidad, pandemia — cruzado con la data de titulación.',
        image: labosferaDatos,
        imageCaption:
          'Minería de datos: seis periodos quinquenales con métricas de ingreso, egreso, mención y áreas de trabajo por titulado.',
        figureAspect: 1,
      },
      {
        id: 4,
        label: 'Etapa 4 — Sistema visual',
        text:
          'Cada individuo se representa como un punto en el espacio. Cada periodo, como una esfera de puntos que respira; los hitos históricos deforman su trayectoria. Alrededor, esferas de colores marcan las categorías profesionales — editorial, digital, ilustración, moda, gestión, interacción, interiores, producto, branding. La lectura es contemplativa, no analítica: los datos aparecen como constelaciones.',
        image: labosferaEsfera,
        imageCaption:
          'Sistema visual — nubes de puntos que forman esferas por periodo, con categorías profesionales orbitando.',
        figureAspect: 1,
      },
      {
        id: 5,
        label: 'Etapa 5 — Instalación',
        text:
          'Mesa oscura, vidrio templado, botonera de madera. El visitante avanza por los seis periodos pulsando botones físicos — la esfera se reorganiza, los hitos se activan, las categorías cambian de peso. Corre en TouchDesigner sobre Arduino. Presentada como pieza de cierre del Taller Data UDP, noviembre 2024.',
        image: labosferaMueble,
        imageCaption:
          'Render 3D del mueble diseñado para la instalación — mesa de madera con vidrio, botonera y soporte.',
        figureAspect: 1,
      },
      {
        id: 6,
        label: 'Etapa 6 — Pipeline',
        text:
          'Encuesta + MIFUTURO.cl → base de datos → periodo 1995-2019 → ingresos y egresos + áreas de trabajo → TouchDesigner para la lógica generativa → After Effects para el post + Arduino para el input físico + materia y trabajo manual para el mueble. Cinco disciplinas técnicas convergiendo en una pieza.',
        image: labosferaPipeline,
        imageCaption: 'Pipeline técnico completo del proyecto.',
        figureAspect: 1,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // 02 · Censo 2024 · Propuestas de infografía (Globallys · INE, marzo 2025)
  //      Tres exploraciones visuales del mismo dataset. Lorem ipsum en textos
  //      porque el brief pidió solo propuestas visuales, sin contenido.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    slug: 'censo-2024',
    title: 'Censo 2024',
    year: '2024',
    category: 'Infografía · Sistema visual',
    categoryId: 'datos',
    description:
      'Tres propuestas visuales para la infografía Resultados Generales del Censo 2024 (INE).',
    available: true,
    thumbnail: censoPropuesta1,
    headerLabel: 'Proyecto 02',
    stages: [
      {
        id: 1,
        label: 'Etapa 1 — Propuesta rotunda',
        text:
          'Como diseñador freelance en Globallys, me pidieron proponer variantes visuales para la infografía Resultados Generales del Censo 2024 del Instituto Nacional de Estadísticas. El brief era puramente formal — no hubo requisito de contenido. Esta primera propuesta parte del bloque pink como ancla: la cifra total de población domina la parte superior y el resto de los datos se organizan en tarjetas alrededor. Lectura rotunda, casi de campaña.',
        image: censoPropuesta1,
        imageCaption:
          'Propuesta 1 — Resultados generales. Bloque pink como ancla visual dominante.',
        figureAspect: 1700 / 2800,
      },
      {
        id: 2,
        label: 'Etapa 2 — Propuesta sobria',
        text:
          'Misma información, otro tono. Se elimina el bloque de color, las siluetas humanas suplantan al donut de género, y la comparación histórica pasa de tabla estática a gráficos de línea y barras. La pieza se siente informe institucional en vez de póster de campaña.',
        image: censoPropuesta2,
        imageCaption:
          'Propuesta 2 — variante editorial. Sin bloque de color; gráficos de tiempo para la comparación entre censos.',
        figureAspect: 1700 / 2800,
      },
      {
        id: 3,
        label: 'Etapa 3 — Propuesta modular',
        text:
          'Variante regional pensada para escalar a las dieciséis regiones (Arica y Parinacota como piloto). El bloque pink se reformula como contenedor del nombre de región. Suma stats de hogar y un código QR con CTA de escaneo. La pieza deja de ser póster y empieza a comportarse como interfaz de acceso.',
        image: censoPropuesta3,
        imageCaption:
          'Propuesta 3 — variante regional con QR de acceso extendido.',
        figureAspect: 1700 / 2800,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // 03 · El Mercado del Agua — case study del 2023 sobre crisis hídrica en Petorca.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    slug: 'mercado-del-agua',
    title: 'El Mercado del Agua',
    year: '2023',
    category: 'Visualización de datos + Instalación',
    categoryId: 'datos',
    description:
      'Crisis hídrica en Petorca leída a través del mercado de derechos de aprovechamiento del agua.',
    available: true,
    thumbnail: mdaDiscoManchas,
    thumbnailVideo: '/mercado-del-agua-hero.mp4',
    headerLabel: 'Proyecto 03',
    stages: [
      {
        id: 1,
        label: 'Etapa 1 — Contexto',
        text:
          'En Petorca hay agua, pero el promedio de distribución para la población llega a veinte litros por persona: un ochenta por ciento menos del mínimo establecido por la OMS. La crisis hídrica de la comuna tiene tanto causas naturales — sequía, cambio climático — como de mercado: la acumulación privada de derechos de aprovechamiento del agua por parte de la industria agropecuaria.',
        image: mdaMesa,
        imageCaption:
          'Foto 1. Detalle de la mesa: título e introducción de la pieza.',
      },
      {
        id: 2,
        label: 'Etapa 2 — El mercado',
        text:
          'En Chile el agua se compra y se vende. Quienes poseen más derechos de aprovechamiento obtienen más agua y, a la vez, más compras del Estado, que intenta compensar mediante camiones aljibe la escasez que la industria misma provoca en la población. Un ciclo que se retroalimenta: la privatización del recurso amplifica su propia escasez.',
        image: mdaVisualizacion,
        imageCaption:
          'Composición final de la pieza — mapa de puntos de la cuenca, disco elíptico, barras de usos y cifra de gasto estatal.',
        figureAspect: 1,
      },
      {
        id: 3,
        label: 'Etapa 3 — Los datos',
        text:
          'Co-relacionamos tres bases públicas de la Dirección General de Aguas: catastro de derechos de aprovechamiento, denuncias por extracción ilegal y rutas de camiones aljibe en la V Región. El cruce ubica cada uso sobre el mapa. Medido por volumen asignado, el reparto en Petorca hace rotundo el diagnóstico.',
        figureKey: 'mda-data-bar',
      },
      {
        id: 4,
        label: 'Etapa 4 — Pipeline',
        text:
          'De las bases DGA a la pieza: los datos alimentan una visualización preliminar en TouchDesigner, luego pasan por After Effects para su post-producción, y de ahí se bifurcan en dos salidas — la animación del disco y los datos ya legibles — que se recomponen en la visualización final.',
        image: mdaPipeline,
        imageCaption:
          'Pipeline técnico: TouchDesigner → After Effects → dos salidas (animación + datos) → composición final.',
        figureAspect: 1,
      },
      {
        id: 5,
        label: 'Etapa 5 — Sistema visual',
        text:
          'La cuenca del río Petorca aparece como un mapa de puntos codificados por color: verde para derechos de aprovechamiento, morado para camiones aljibe, rojo para extracciones ilegales. Sobre el mapa, un disco elíptico separado funciona como metáfora: es el agua misma, que pasa de un verde vivo a manchas rojas cuando las ilegalidades se acumulan. El disco no ilustra los datos: los encarna.',
        image: mdaDiscoVerde,
        imageCaption:
          'Foto 3. El disco en su estado base — verde saturado, mapa proyectado al costado. La metáfora antes del desequilibrio.',
      },
      {
        id: 6,
        label: 'Etapa 6 — Instalación',
        text:
          'En la exposición universitaria la pieza se montó como mesa oscura con proyección del mapa y sus leyendas, y el disco físico separado en un soporte vertical. El visitante lee la información leyendo el disco: cuando el rojo crece, sabe que las denuncias están ganando. La lectura no es panel-de-control: es contemplativa.',
        image: mdaSalaRojo,
        imageCaption:
          'Foto 4. Vista de la sala durante la exposición — visitantes al fondo, disco encendido en primer plano.',
      },
      {
        id: 7,
        label: 'Etapa 7 — Cierre',
        text:
          '«Hace mucho tiempo / había vida en mí / venían los pajaritos / hace mucho tiempo / crecían las flores». Canción sobre el río escrita por estudiantes de la escuela Carlos Ariztia de Trapiche.',
        image: mdaDiscoRojoCerca,
        imageCaption:
          'Foto 5. El disco al final del ciclo — la escasez desbordada, en primer plano.',
        variant: 'quote',
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // Edubig — Product design. Case study dedicado (EdubigCaseStudy).
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    slug: 'edubig',
    title: 'Edubig',
    year: '2026',
    category: 'Product design',
    categoryId: 'ux-ui',
    description:
      'Plataforma de decisión escolar para familias de la comuna de Pudahuel.',
    available: true,
    thumbnail: edubigThumb,
    headerLabel: 'Proyecto 06',
    stages: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  // 04 · Sitemap INE — Rediseño de arquitectura de información del portal del
  //      Censo 2024 del Instituto Nacional de Estadísticas (Globallys · 2025).
  //      Primer proyecto UX-UI real del portafolio. La propuesta se implementó
  //      en censo2024.ine.gob.cl (verificable in situ). Assets: 5 páginas del
  //      kit de validación (portrait 1242×1755) + 1 árbol de sitemap ultra-wide
  //      (3850×1038, aspect 3.71) que empuja el límite del contenedor 736×… —
  //      se acepta la altura pequeña porque el tree es la pieza que prueba el
  //      trabajo, no ornamentación.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    slug: 'sitemap-ine',
    title: 'Sitemap INE',
    year: '2025',
    category: 'Arquitectura de información',
    categoryId: 'ux-ui',
    description:
      'Rediseño del árbol de contenidos del portal del Censo 2024 del INE — validado, documentado e implementado.',
    available: true,
    thumbnail: sitemapTree,
    thumbnailVideo: '/sitemap-ine-recorrido.mp4',
    thumbnailFit: 'contain',
    headerLabel: 'Proyecto 04',
    stages: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  // 05 · Sistema MIU — aspiracional. Se mantiene la card en el carrusel como
  //      "En preparación" hasta que exista contenido real (fotos, capturas,
  //      pieza construida). Las stages quedan preservadas abajo como esqueleto
  //      para retomar cuando corresponda.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    slug: 'sistema-miu',
    title: 'Sistema MIU',
    year: '2024',
    category: 'Diseño generativo',
    categoryId: 'datos',
    description:
      'Exploración del sistema MIU de Hofstadter aplicado a tipografía generativa.',
    available: false,
    headerLabel: 'Proyecto 05',
    stages: [
      {
        id: 1,
        label: 'Etapa 1 — Contexto',
        text:
          'El proyecto nació de una pregunta sobre los límites de los sistemas formales: ¿puede una serie de reglas simples generar complejidad infinita? El sistema MIU de Douglas Hofstadter sirvió como marco: partiendo de la cadena MI, cuatro reglas de producción generan transformaciones indefinidas.',
      },
      {
        id: 2,
        label: 'Etapa 2 — Investigación',
        text:
          'Se investigaron las propiedades matemáticas del sistema: la invariante de Hofstadter, la imposibilidad de alcanzar MU, y la relación entre recursividad y emergencia. Esta fase incluyó revisión de literatura sobre sistemas formales, gramáticas generativas y diseño algorítmico.',
      },
      {
        id: 3,
        label: 'Etapa 3 — Referentes',
        text:
          'Se analizaron referentes que cruzan sistemas lógicos con diseño visual: desde los autómatas celulares de Conway hasta los proyectos tipográficos de Metadesign. La pregunta guía fue cómo visualizar una regla sin ilustrarla literalmente.',
      },
      {
        id: 4,
        label: 'Etapa 4 — Prototipado',
        text:
          'Los primeros prototipos implementaron las cuatro reglas del sistema MIU en p5.js: Regla I (MI→MII), Regla II (Mx→Mxx), Regla III (xIIIy→xUy) y Regla IV (xUUy→xy). Cada cadena generada se tradujo a una forma visual mediante coordenadas.',
      },
      {
        id: 5,
        label: 'Etapa 5 — Desarrollo tipográfico',
        text:
          'A partir del prototipo se construyó un sistema tipográfico generativo donde cada glifo corresponde a una cadena del árbol. La variación de peso, eje y proporciones depende de la longitud y composición de la cadena que lo origina.',
      },
      {
        id: 6,
        label: 'Etapa 6 — Iteración',
        text:
          'Se realizaron múltiples ciclos de ajuste: parámetros de mapeo, escala visual, densidad del árbol. Se descartaron ramas del sistema que producían formas ilegibles o visualmente triviales, buscando el equilibrio entre complejidad y coherencia.',
      },
      {
        id: 7,
        label: 'Etapa 7 — Instalación',
        text:
          'El trabajo culminó en un entorno interactivo donde el visitante aplica las reglas en tiempo real. La interfaz expone el árbol de derivación: cada nodo es un glifo, cada arista es una regla aplicada. MU aparece siempre fuera del árbol, en el borde de la pantalla.',
      },
      {
        id: 8,
        label: 'Etapa 8 — Documentación',
        text:
          'Se documentó el sistema mediante publicación editorial que registra el proceso, las decisiones descartadas y los diagramas de derivación. La publicación funciona como partitura del sistema: permite reproducirlo sin ejecutarlo.',
      },
      {
        id: 9,
        label: 'Etapa 9 — Exhibición',
        text:
          'El proyecto se presentó en el Salón de Diseño UDP 2024. La instalación fue recibida con interés por su capacidad de hacer visible un proceso lógico sin reducirlo a una infografía. MU permaneció siempre inalcanzable, fiel a la demostración de Hofstadter.',
      },
      {
        id: 10,
        label: 'Etapa 10 — Conclusiones',
        text:
          'El sistema MIU demostró que la restricción generativa puede ser un método de diseño productivo. La imposibilidad de alcanzar MU no es un fracaso del sistema: es su punto más revelador. Un horizonte que ordena sin ser alcanzado es también una descripción posible del diseño.',
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // Placeholders — próximos case studies (visibles como "En preparación")
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    slug: 'tribu-impulsa',
    title: 'Tribu Impulsa',
    year: '2025',
    category: 'Product design',
    categoryId: 'ux-ui',
    description: 'Plataforma chilena de emprendimiento y networking.',
    available: false,
    headerLabel: 'Proyecto 07',
    stages: [],
  },
  {
    id: 5,
    slug: 'vivit-accesibilidad',
    title: 'Vivit — Accesibilidad',
    year: '2025',
    category: 'Investigación UX',
    categoryId: 'ux-ui',
    description:
      'Benchmark consolidado de mejores prácticas en extensiones de accesibilidad web.',
    available: false,
    headerLabel: 'Proyecto 08',
    stages: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  // Editorial — Ebooks TUXPAN. Case study dedicado (TuxpanCaseStudy).
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    slug: 'ebooks-tuxpan',
    title: 'Ebooks TUXPAN',
    year: '2025',
    category: 'Diseño editorial',
    categoryId: 'editorial',
    description:
      'Serie de tres ebooks descargables para captación de leads B2B — diagramación, ilustración y arte final.',
    available: true,
    thumbnail: tuxpanThumb,
    headerLabel: 'Proyecto 09',
    stages: [],
  },
];

/** Devuelve los proyectos que pertenecen a una categoría dada. */
export function projectsByCategory(categoryId: CategoryId): Project[] {
  return projects.filter(p => p.categoryId === categoryId);
}

/** Búsqueda por id — usada por ProjectDetail para saber qué proyecto renderizar. */
export function getProjectById(id: number): Project | undefined {
  return projects.find(p => p.id === id);
}
