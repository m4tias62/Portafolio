import { useEffect, useRef, useState } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';

import logo from '@/assets/edubig/logo.png';
import tarjeta from '@/assets/edubig/tarjeta-colegio.png';
import bocetoToggle from '@/assets/edubig/boceto-toggle.jpg';
import formalizacionLogo from '@/assets/edubig/formalizacion-logo.png';

import personaCarolina from '@/assets/edubig/persona-carolina.png';
import personaMartin from '@/assets/edubig/persona-martin.png';
import personaTomas from '@/assets/edubig/persona-tomas-francisca.png';

import scHomeLista from '@/assets/edubig/screen-home-lista.jpg';
import scMapa from '@/assets/edubig/screen-mapa.jpg';
import scFichaTop from '@/assets/edubig/screen-ficha-top.jpg';
import scFichaAcademico from '@/assets/edubig/screen-ficha-academico.jpg';
import scFichaBienestar from '@/assets/edubig/screen-ficha-bienestar.jpg';
import scQ1 from '@/assets/edubig/screen-q1.jpg';
import scQ2 from '@/assets/edubig/screen-q2.jpg';
import scQ3 from '@/assets/edubig/screen-q3.jpg';
import scQ4 from '@/assets/edubig/screen-q4.jpg';
import scQ5a from '@/assets/edubig/screen-q5a.jpg';
import scQ5b from '@/assets/edubig/screen-q5b.jpg';
import scLoading from '@/assets/edubig/screen-loading.jpg';
import scShortlist from '@/assets/edubig/screen-shortlist.jpg';
import scCompTop from '@/assets/edubig/screen-comparacion-top.jpg';
import scCompCuerpo from '@/assets/edubig/screen-comparacion-cuerpo.jpg';

/**
 * EdubigCaseStudy — case study dedicado de Edubig (rediseñado 2026-09-14).
 *
 * Traspasa a React la maqueta que se hizo en Claude Design (`eduBIG Case
 * Study.dc.html`, auditada en contenido y forma por el usuario). Estructura
 * editorial en 11 stages numeradas, con figuras enmarcadas (borde asimétrico
 * 1/4/4/1) y una interacción por pestañas para las tres personas.
 *
 * Sistema del portafolio conservado (regla del 2026-09-11): NavBar (la pone
 * App), BackButton, regla vertical (ProgressBar) y el indent `pl-[188px]` que
 * usan todos los detalles de proyecto. Fuentes oficiales IBM Plex Mono/Sans
 * — nombres EXACTOS registrados en `src/index.css`. Todo el CSS propio vive
 * bajo `.eb` para no filtrarse al resto del sitio.
 *
 * Los dos videos del proyecto (pipeline en 16:9, recorrido del Test de Calce
 * en 9:16) ya viven en `public/` y se cargan aquí en reemplazo de los stubs
 * de la maqueta.
 */

// ─── DATA ──────────────────────────────────────────────────────────────────

type Persona = {
  n: string;
  nombre: string;
  comuna: string;
  perfil: string;
  cita: string;
  retrato: string;
  meta: [string, string][];
  dolores: { dolor: string; sev: string; efecto: string }[];
  implicaciones: string[];
};

const PERSONAS: Persona[] = [
  {
    n: '01',
    nombre: 'Carolina Muñoz',
    comuna: 'Pudahuel',
    perfil: 'La mamá práctica',
    retrato: personaCarolina,
    cita: '«A mí no me vengan con siglas ni números raros que no entiendo; solo necesito saber si el colegio es gratis, si a mi hijo le queda a una pura micro y si va a estar tranquilo sin que nadie me lo ande molestando».',
    meta: [
      ['Edad', '36 años'],
      ['Trabajo', 'Auxiliar de aseo'],
      ['Familia', 'Madre soltera, 2 hijos (8 y 14)'],
      ['Equipo', 'Android, sin computador en casa'],
    ],
    dolores: [
      { dolor: 'No entiende el lenguaje técnico: GSE, IDPS, SIMCE y RBD son siglas sin significado para ella.', sev: 'Crítica', efecto: 'Bloquea el uso' },
      { dolor: 'No tiene computador: toda su navegación es en celular y los portales oficiales no están optimizados para móvil.', sev: 'Crítica', efecto: 'Bloquea el acceso' },
      { dolor: 'Información fragmentada: comparar dos colegios exige abrir cuatro portales distintos.', sev: 'Alta', efecto: 'Genera abandono' },
      { dolor: 'Presión de tiempo: el SAE tiene plazos rígidos y no tiene semanas para investigar.', sev: 'Alta', efecto: 'Genera ansiedad' },
      { dolor: 'Desconfianza de «los números»: sabe que los rankings pueden engañar, pero no tiene herramientas para evaluar por sí misma.', sev: 'Media', efecto: 'Genera inseguridad' },
    ],
    implicaciones: [
      'Lenguaje simple primero, técnico después. Nunca «IDPS: 78»; sí «Bienestar escolar: alto — los estudiantes reportan sentirse seguros y acompañados».',
      'Filtro de gratuidad como primer nivel, no enterrado en filtros avanzados.',
      'Mapa como interfaz principal de búsqueda: la proximidad es su criterio número uno y necesita verla espacialmente.',
    ],
  },
  {
    n: '02',
    nombre: 'Tomás y Francisca',
    comuna: 'Providencia',
    perfil: 'La pareja investigadora',
    retrato: personaTomas,
    cita: '«Un ranking general o un puntaje aislado no nos dice nada. Necesitamos comparar datos objetivos en el tiempo frente a colegios equivalentes, para evaluar tanto la exigencia académica como el bienestar socioemocional de nuestra hija».',
    meta: [
      ['Edad', '39 y 37 años'],
      ['Trabajo', 'Ingeniero comercial · psicóloga clínica'],
      ['Familia', '1 hija (5 años, entrando a 1° básico)'],
      ['Equipo', 'Alfabetización digital alta; planillas propias'],
    ],
    dolores: [
      { dolor: 'La comparación es manual y agotadora: horas cruzando datos de cuatro fuentes en su propia planilla.', sev: 'Crítica', efecto: 'Es su dolor central' },
      { dolor: 'Desconfianza de rankings simplistas: han visto listados de «mejores colegios» que contradicen lo que ven en terreno.', sev: 'Alta', efecto: 'Genera escepticismo' },
      { dolor: 'Incertidumbre de interpretación: Francisca leyó el IDPS, pero no sabe si 72 en clima escolar es bueno para un colegio de ese GSE.', sev: 'Alta', efecto: 'Genera parálisis' },
      { dolor: 'Tensión de pareja: Tomás se inclina por el mejor SIMCE, Francisca por el mejor IDPS, y no tienen cómo ponderar ambas dimensiones.', sev: 'Alta', efecto: 'Genera ansiedad' },
    ],
    implicaciones: [
      'El comparador es su feature killer: tiene que funcionar impecable para este perfil.',
      'Etiquetas contextuales obligatorias. «72 en clima escolar» no dice nada; «sobre el promedio de colegios de su mismo GSE» lo cambia todo.',
      'Link a metodología siempre visible: si no pueden verificar la fuente, no confían — y sin confianza no usan.',
    ],
  },
  {
    n: '03',
    nombre: 'Martín Soto',
    comuna: 'Paine',
    perfil: 'El estudiante que co-decide',
    retrato: personaMartin,
    cita: '«Solo quiero ver desde el teléfono si este colegio de verdad me prepara para sacar buen puntaje en la PAES y si tiene un buen ambiente, sin tener que navegar por páginas complicadas ni leer informes eternos».',
    meta: [
      ['Edad', '16 años'],
      ['Curso', 'Estudiante de III° medio'],
      ['Familia', 'Vive con su madre y su abuela'],
      ['Equipo', 'Android, el único dispositivo de la casa'],
    ],
    dolores: [
      { dolor: 'Las plataformas están diseñadas para adultos: el tono y la complejidad lo expulsan. No se siente el usuario esperado.', sev: 'Crítica', efecto: 'Abandona rápido' },
      { dolor: 'No encuentra rápido lo que le importa: tarda quince minutos en ver resultados PAES en el portal DEMRE.', sev: 'Alta', efecto: 'Genera frustración' },
      { dolor: 'No tiene con quién hablar de esto: su madre no maneja los datos y el orientador no tiene tiempo.', sev: 'Media', efecto: 'Genera aislamiento' },
    ],
    implicaciones: [
      'Velocidad de carga como requisito, no como optimización: su estándar lo fija TikTok, no el portal del ministerio.',
      'Módulo PAES arriba en la ficha de colegios de media, no al final.',
      'Proyecto educativo como identidad, no como documento: «foco en ciencias, taller de robótica, selección de fútbol», no un PDF de veinte páginas.',
    ],
  },
];

const FUENTES: { n: string; nombre: string; detalle: string; tono: string }[] = [
  { n: '01', nombre: 'Directorio Mineduc', detalle: 'RBD, dependencia, nivel, copago', tono: '#053061' },
  { n: '02', nombre: 'SIMCE', detalle: 'Agencia de Calidad · 4° y 8° básico', tono: '#2166ac' },
  { n: '03', nombre: 'IDPS', detalle: 'Cinco dimensiones de desarrollo personal y social', tono: '#2166ac' },
  { n: '04', nombre: 'Denuncias Supereduc', detalle: 'Materia y estado de tramitación', tono: '#4393c3' },
  { n: '05', nombre: 'Geolocalización', detalle: 'Distancia real al domicilio', tono: '#4393c3' },
  { n: '06', nombre: 'PAES', detalle: 'Trayectoria de egreso', tono: '#92c5de' },
];

type Capa = {
  n: string;
  capa: string;
  stack: string;
  modo: string;
  registro: [string, string][];
};

const CAPAS: Capa[] = [
  {
    n: '01', capa: 'Pipeline de datos', stack: 'Python · Pandas · seis datasets oficiales', modo: 'Modo pedagógico',
    registro: [
      ['Dirigí', 'La escritura del código y el orden en que se cruzan los seis datasets.'],
      ['Generó', 'La explicación del porqué antes del cómo. No entra una línea que no pueda reconstruir solo.'],
      ['Validé', 'Contra las fuentes oficiales, campo por campo.'],
    ],
  },
  {
    n: '02', capa: 'Diseño en Figma', stack: 'Wireframes de media y alta fidelidad · Figma con MCP', modo: 'Modo iterativo',
    registro: [
      ['Dirigí', 'El criterio y la mejora. Los wireframes de media y alta fidelidad, los estados de cada componente y los recorridos completos quedan cerrados acá, antes de que exista una línea de frontend: este archivo es la especificación.'],
      ['Generó', 'Wireframes de partida sobre los que trabajo encima. Su valor es la velocidad de iteración, no la propuesta: acortan el costo de descartar una dirección.'],
      ['Validé', 'Contra los cinco dolores de la investigación, pantalla por pantalla.'],
    ],
  },
  {
    n: '03', capa: 'Frontend', stack: 'Next.js 14 App Router · Tailwind', modo: 'Modo delegado',
    registro: [
      ['Dirigí', 'Reglas de negocio y edge cases: qué pasa cuando un colegio no tiene SIMCE publicado.'],
      ['Generó', 'La implementación contra especificación.'],
      ['Validé', 'El recorrido completo, no el componente aislado.'],
    ],
  },
  {
    n: '04', capa: 'Sistema de diseño', stack: 'tailwind.config.ts · globals.css · web-app/', modo: 'Auditoría',
    registro: [
      ['Dirigí', 'El alcance: qué código se audita y contra qué criterio.'],
      ['Generó', 'La revisión contra WCAG 2.2 AA y los tokens corregidos.'],
      ['Validé', 'Ratio de contraste y objetivo táctil, uno por uno.'],
    ],
  },
];

type Eslabon = {
  n: string;
  rol: string;
  frio: string;
  frioGloss: string;
  calido: string;
  calidoGloss: string;
};

const ESLABONES: Eslabon[] = [
  {
    n: '01', rol: 'Origen',
    frio: 'imparcial', frioGloss: 'El dato no toma partido por ningún colegio: solo registra lo que las seis fuentes oficiales publican.',
    calido: 'cuidado', calidoGloss: 'La familia no parte de la curiosidad: parte de querer que a su hijo le vaya bien.',
  },
  {
    n: '02', rol: 'Término medio',
    frio: 'frío', frioGloss: 'Ser imparcial vuelve al dato frío. No consuela, no acompaña, no se adapta a quién pregunta.',
    calido: 'preocupación', calidoGloss: 'Cuidar vuelve a la familia preocupada. La decisión importa, y eso incomoda.',
  },
  {
    n: '03', rol: 'Resultado',
    frio: 'honesto', frioGloss: 'Pero un dato frío es un dato honesto: no promete lo que no puede sostener.',
    calido: 'seguridad', calidoGloss: 'Y una preocupación atendida con un dato honesto termina en seguridad: se puede decidir con esto.',
  },
];

type Decision = {
  n: string;
  ambito: string;
  titulo: string;
  tension: string;
  resolucion: string;
  costo: string;
};

const DECISIONES: Decision[] = [
  {
    n: '01', ambito: 'Arquitectura', titulo: 'Acompañar antes que listar',
    tension: 'Un buscador con filtros asume que la familia ya sabe qué criterios aplicar. La investigación mostró lo contrario: llega sin saber qué preguntar, y una lista de 7.168 colegios filtrable no resuelve eso.',
    resolucion: 'El CTA primario del home es el Test de Calce, no el buscador. La exploración manual queda bajo «o explora por tu cuenta»: disponible, no primera. El recorrido por defecto termina en una shortlist de tres colegios que calzan, no en resultados.',
    costo: 'Se antepone un flujo de cinco preguntas a quien solo quería buscar un nombre, y el producto asume la responsabilidad de haber acotado bien.',
  },
  {
    n: '02', ambito: 'Motor', titulo: 'Motor determinístico, no caja negra',
    tension: 'Un modelo entrenado recomienda mejor en promedio, pero no puede explicar una recomendación concreta a la familia que la recibe.',
    resolucion: 'Reglas explícitas, ponderaciones públicas y metodología consultable desde la propia recomendación.',
    costo: 'Se resigna precisión estadística. El sistema no aprende de lo que hacen los usuarios.',
  },
  {
    n: '03', ambito: 'Contexto', titulo: 'Comparación contra grupo GSE',
    tension: 'Comparar un colegio contra el promedio nacional premia la composición socioeconómica del alumnado y castiga al colegio que trabaja bien en contexto adverso.',
    resolucion: 'Todo indicador se lee contra colegios de grupo socioeconómico similar. Las etiquetas son Sobre, Similar y Bajo respecto de ese grupo, nunca un ranking absoluto.',
    costo: 'Desaparece la respuesta simple a «¿cuál es el mejor colegio de Chile?». La pregunta queda sin contestar a propósito.',
  },
  {
    n: '04', ambito: 'Datos', titulo: 'Series IDPS separadas, nunca un score único',
    tension: 'Clima escolar, autoestima, hábitos y participación miden cosas distintas. Promediarlas produce un número más cómodo y menos cierto.',
    resolucion: 'Las cuatro dimensiones se muestran como series independientes, cada una contra su grupo GSE. El Test de Calce agrupa en Bienestar y Convivencia solo para ponderar, y aun ahí pregunta dónde poner más peso — nunca cuál descartar.',
    costo: 'La familia lee cuatro barras donde otros productos muestran una. Más carga de lectura, menos titular.',
  },
  {
    n: '05', ambito: 'Tono', titulo: 'Nota de legitimación',
    tension: 'El Test de Calce pregunta qué prioriza la familia. Toda pregunta de preferencia implica que hay respuestas mejores que otras, y eso culpabiliza a quien elige distinto.',
    resolucion: 'Cada resultado del test valida explícitamente la combinación elegida antes de mostrar colegios. No hay perfil incorrecto.',
    costo: 'Más texto antes del resultado, y el producto renuncia a la autoridad de decirle a la familia qué debería priorizar.',
  },
];

type Dim = {
  nombre: string;
  que: string;
  valor: string;
  delta: string;
  ancho: string;
  colapso: string;
  anchoColapso: string;
};

const DIMENSIONES: Dim[] = [
  { nombre: 'Clima escolar', que: 'Convivencia · qué tan respetuosa y segura la sienten', valor: '70', delta: '−5', ancho: '70%', colapso: '75', anchoColapso: '75%' },
  { nombre: 'Participación', que: 'Convivencia · pertenencia y formación ciudadana', valor: '74', delta: '−4', ancho: '74%', colapso: '78', anchoColapso: '78%' },
  { nombre: 'Autoestima académica', que: 'Bienestar · confianza y motivación para aprender', valor: '70', delta: '−4', ancho: '70%', colapso: '74', anchoColapso: '74%' },
  { nombre: 'Hábitos de vida saludable', que: 'Bienestar · alimentación, actividad física, autocuidado', valor: '67', delta: '−5', ancho: '67%', colapso: '72', anchoColapso: '72%' },
];

const USOS_EJE: { tono: string; estado: string; donde: string }[] = [
  { tono: '#2166ac', estado: 'Frío · dato sin traducir', donde: 'Card en estado default dentro de la lista general. Todavía no sabe nada de vos.' },
  { tono: '#d6604d', estado: 'Cálido · en foco', donde: 'Hover sobre la card: cruza al lado cálido porque revela más información que la lista. Era #f4a582 hasta la auditoría de contraste de la stage 08.2' },
  { tono: '#d6604d', estado: 'Cálido · traducido', donde: 'Cards de la shortlist que devuelve el Test de Calce, armadas contra las necesidades declaradas.' },
  { tono: '#b2181f', estado: 'Cálido · extremo', donde: 'Isologo y marca. El punto de llegada de la traducción.' },
];

const USOS_CUAL: { tono: string; estado: string; donde: string }[] = [
  { tono: '#2f7d32', estado: 'Salud', donde: 'Áreas de carrera de destino de los egresados.' },
  { tono: '#2b4fc4', estado: 'Ingeniería', donde: 'Misma serie, categoría sin jerarquía respecto de las otras.' },
  { tono: '#c0392b', estado: 'Cs. Sociales', donde: 'El rojo acá no significa «peor»: significa un área distinta.' },
  { tono: '#7b52c9', estado: 'Educación', donde: 'Cuarta categoría de la distribución de matrícula.' },
  { tono: '#5a5a55', estado: 'Otras', donde: 'Agrupa la cola larga de áreas con matrícula menor.' },
];

type FrameTraduccion = {
  estado: string;
  tono: string;
  url: string;
  alt: string;
  recorte: string;
  nota: string;
};

const FRAMES_TRAD: FrameTraduccion[] = [
  {
    estado: 'Frío · exploración manual', tono: '#2166ac',
    url: scHomeLista,
    alt: 'Home mobile con lista de colegios en cards de borde azul',
    recorte: 'Vista superior · corta tras la primera card',
    nota: 'La lista general. Cards de borde frío: el colegio está ahí porque vos lo buscaste, no porque el sistema lo eligió para vos.',
  },
  {
    estado: 'Puente · el traductor operando', tono: '#9a9a92',
    url: scLoading,
    alt: 'Pantalla de carga con el texto Traduciendo tus respuestas',
    recorte: 'Pantalla completa',
    nota: '«Traduciendo tus respuestas… Estamos comparando tus prioridades con los colegios de tu comuna.» El concepto rector como microcopy funcional.',
  },
  {
    estado: 'Cálido · resultado traducido', tono: '#d6604d',
    url: scShortlist,
    alt: 'Shortlist de tres colegios que calzan, en cards de borde cálido',
    recorte: 'Vista superior · corta tras la primera card',
    nota: 'Misma card, borde cálido y chips de calce. «Estos son los colegios que calzan con tu familia»: el dato ya pasó por las cinco respuestas.',
  },
];

type Contraste = {
  hex: string;
  uso: string;
  ratio: string;
  veredicto: string;
  marca: string;
  tintaVeredicto: string;
};

const CONTRASTE: Contraste[] = [
  { hex: '#1F1F1F', uso: 'Texto principal de ficha y comparación', ratio: '16,5:1', veredicto: 'AA y AAA', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#b2181f', uso: 'Extremo cálido del eje. Isologo y acentos de texto', ratio: '6,9:1', veredicto: 'AA texto normal', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#0958D9', uso: 'Botones, foco, enlaces', ratio: '6,2:1', veredicto: 'AA texto normal', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#2166ac', uso: 'Extremo frío. Bordes de card en lista y barras de pares', ratio: '5,9:1', veredicto: 'AA texto normal', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#767676', uso: 'Texto secundario, notas de fuente', ratio: '4,6:1', veredicto: 'AA justo. No bajar de 4,5', marca: '#9a9a92', tintaVeredicto: '#1a1a18' },
  { hex: '#d6604d', uso: 'Cálido medio. Borde de card en shortlist', ratio: '3,7:1', veredicto: 'Solo no textual y texto grande', marca: '#9a9a92', tintaVeredicto: '#1a1a18' },
  { hex: '#4393c3', uso: 'Frío medio. Barras de visualización', ratio: '3,4:1', veredicto: 'Solo no textual', marca: '#9a9a92', tintaVeredicto: '#1a1a18' },
  { hex: '#f4a582', uso: 'Cálido claro. Era el borde de card en hover', ratio: '2,0:1', veredicto: 'Falla incluso como no textual', marca: '#b2181f', tintaVeredicto: '#8a1a20' },
];

type Criterio = {
  sc: string;
  nombre: string;
  estado: string;
  tinta: string;
  borde: string;
  riesgo: string;
  respuesta: string;
};

const CRITERIOS: Criterio[] = [
  {
    sc: 'SC 1.4.1', nombre: 'Uso del color', estado: 'Corregido', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    riesgo: 'El eje frío–cálido codifica de dónde vino el dato. Si esa es la única señal, quien no distingue azul de rojo pierde la diferencia entre un colegio que encontró navegando y uno que el sistema le trajo.',
    respuesta: 'La temperatura nunca va sola: la shortlist se anuncia por encabezado («Estos son los colegios que calzan con tu familia») y cada card cálida suma chips de calce que no existen en la lista general.',
  },
  {
    sc: 'SC 1.4.11', nombre: 'Contraste no textual', estado: 'Token retirado', tinta: '#8a1a20', borde: 'rgba(178,24,31,0.44)',
    riesgo: 'El borde de hover en #f4a582 daba 2,0:1 contra blanco. El estado existía en el sistema y era invisible en la pantalla.',
    respuesta: 'El hover pasa a #d6604d (3,7:1) y suma elevación, de modo que el cruce a cálido se sostiene sin depender de un tono que no llega al umbral.',
  },
  {
    sc: 'SC 2.5.8', nombre: 'Tamaño del objetivo', estado: 'Cumple', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    riesgo: 'El Test de Calce se responde con una mano, caminando. Opciones chicas o pegadas producen respuestas equivocadas en un cuestionario que después arma la shortlist.',
    respuesta: 'Las opciones son bloques de ancho completo con 44px de alto mínimo y separación propia. El umbral 2.2 pide 24px: el producto lo duplica porque el error no es cosmético, contamina el resultado.',
  },
];

type Screen = { url: string; alt: string; ratio: string; recorte: string; pie: string };
type Bloque = {
  n: string;
  titulo: string;
  tono: string;
  vienen: string[];
  notas: string[];
  screens: Screen[];
};

const PRODUCTO: Bloque[] = [
  {
    n: '01', titulo: 'Home · lista y mapa', tono: '#2166ac',
    vienen: ['Decisión 01 · Acompañar antes que listar', 'Carolina · el mapa como interfaz'],
    notas: [
      'El CTA primario es el Test de Calce; la exploración manual queda disponible bajo «o explora por tu cuenta». La lista no desaparece, deja de ser la puerta.',
      'Los chips de filtro nacen fríos y se calientan al seleccionarse: sin filtro el dato es imparcial, con filtro la búsqueda ya se adaptó a una necesidad declarada.',
      'Lista y mapa son dos vistas del mismo resultado, no dos secciones. Carolina elige por proximidad y necesita verla espacialmente; el mapa es su entrada, la lista es la de quien ya sabe qué comparar.',
    ],
    screens: [
      { url: scHomeLista, alt: 'Home en móvil con lista de colegios y chips de filtro', ratio: '390 / 845', recorte: 'Vista Lista · corta dentro del listado', pie: 'Cards en estado frío: todavía no sabe nada de la familia.' },
      { url: scMapa, alt: 'Home en móvil, vista Mapa: pines de colegios en Pudahuel con el popup de Escuela Albert Einstein', ratio: '390 / 670', recorte: 'Vista Mapa · mismo set de filtros', pie: 'El toggle Lista / Mapa no cambia de pantalla: cambia de lenguaje sobre los mismos resultados. El pin abre nombre, RBD, comuna y la entrada a la ficha.' },
    ],
  },
  {
    n: '02', titulo: 'Ficha del colegio', tono: '#2166ac',
    vienen: ['Decisión 03 · Comparación contra grupo GSE', 'Decisión 04 · Series IDPS separadas', 'Tomás y Francisca · etiquetas contextuales'],
    notas: [
      'Módulo Académico: la brecha SIMCE se dibuja en escala fija de ±56 puntos, la misma en todas las fichas. Una escala que se autoajusta hace que una diferencia de 4 puntos se vea igual que una de 40.',
      'Módulo Bienestar: las tres series —este colegio, colegios similares, promedio nacional— se leen separadas. Colapsarlas en un puntaje habría producido un número más cómodo y menos cierto.',
    ],
    screens: [
      { url: scFichaTop, alt: 'Ficha de colegio en móvil: encabezado y resumen «Lo esencial»', ratio: '390 / 845', recorte: 'Encabezado · Lo esencial', pie: 'Escuela Alexander Graham Bell. El resumen ya trae cada dimensión con su etiqueta de contexto, no un puntaje.' },
      { url: scFichaAcademico, alt: 'Módulo Académico de la ficha: brechas SIMCE en Lectura y Matemática', ratio: '390 / 845', recorte: 'Módulo Académico · brechas SIMCE', pie: 'Lectura y Matemática en escala fija ±56, con el signo de la brecha visible por curso.' },
      { url: scFichaBienestar, alt: 'Módulo Bienestar de la ficha: series IDPS separadas', ratio: '390 / 845', recorte: 'Módulo Bienestar · series IDPS', pie: 'Cada dimensión con sus barras separadas: este colegio y colegios similares, nunca un score único.' },
    ],
  },
  {
    n: '03', titulo: 'Test de Calce · Q1–Q5', tono: '#fddbc7',
    vienen: ['Decisión 05 · Nota de legitimación', 'SC 2.5.8 · Objetivos de 44px', 'Martín · responder desde el teléfono'],
    notas: [
      'La barra de progreso se va calentando a medida que la familia responde: no cuenta cuánto falta, muestra cuánto sabe ya el sistema de esa familia.',
      'En las preguntas moralmente cargadas —inclusión, prioridad— se aplica la Nota de legitimación: el texto valida explícitamente todas las respuestas posibles antes de dejar avanzar. No hay perfil incorrecto.',
      'Cada opción es un bloque de ancho completo con 44px de alto mínimo. El umbral WCAG 2.2 pide 24px; acá se duplica porque un toque errado no es cosmético: contamina la shortlist.',
    ],
    screens: [
      { url: scQ1, alt: 'Q1 del Test de Calce: pregunta de copago', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Q1 · Copago. El filtro de gratuidad entra primero, no en filtros avanzados.' },
      { url: scQ2, alt: 'Q2 del Test de Calce: pregunta de inclusión, paso 2', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Q2 · Inclusión. Aquí opera la Nota de legitimación.' },
      { url: scQ3, alt: 'Q3 del Test de Calce: nivel educativo', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Q3 · Nivel.' },
      { url: scQ4, alt: 'Q4 del Test de Calce: distancia al domicilio', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Q4 · Distancia. Criterio número uno de Carolina.' },
      { url: scQ5a, alt: 'Q5 del Test de Calce: prioridad, paso 1', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Q5 · Prioridad. Bienestar y Convivencia solo para ponderar.' },
      { url: scQ5b, alt: 'Q5 paso 2: ponderación de Bienestar', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Q5 · Paso 2. Las dimensiones siguen nombradas una por una.' },
    ],
  },
  {
    n: '04', titulo: 'Traducción y shortlist', tono: '#d6604d',
    vienen: ['Decisión 02 · Motor determinístico', 'SC 1.4.1 · El color nunca va solo'],
    notas: [
      'La espera se llama traducción porque eso es lo que ocurre: reglas explícitas y ponderaciones públicas corriendo sobre las respuestas. No hay modelo que no pueda explicar su resultado.',
      'Las cards de la shortlist nacen cálidas: el sistema ya conoce a la familia. La temperatura nunca es la única señal — el encabezado lo dice en palabras y cada card suma chips de calce que no existen en la lista general.',
    ],
    screens: [
      { url: scLoading, alt: 'Pantalla de carga: traducción en curso', ratio: '390 / 845', recorte: 'Pantalla completa', pie: 'Loading · el eje cruza de frío a cálido durante el cálculo.' },
      { url: scShortlist, alt: 'Shortlist de colegios que calzan con cards de borde cálido', ratio: '390 / 845', recorte: 'Vista superior · corta tras la primera card', pie: 'Shortlist · «Estos son los colegios que calzan con tu familia».' },
    ],
  },
  {
    n: '05', titulo: 'Comparación', tono: '#b2181f',
    vienen: ['Tomás y Francisca · el comparador es su feature killer', 'Estado · fuera del MVP'],
    notas: [
      'Máximo tres colegios en móvil y cuatro en escritorio. El límite no es técnico: por encima de eso la tabla deja de ser comparable de un vistazo y vuelve al problema que el producto vino a resolver.',
      'No está en el MVP: es un prototipo para la versión siguiente. La estructura ya está resuelta y se implementa con el nuevo dataset nacional; los campos que se ven acá son los que el schema tiene que garantizar.',
    ],
    screens: [
      { url: scCompTop, alt: 'Comparación en móvil: tres colegios en columnas y resumen esencial', ratio: '390 / 845', recorte: 'Encabezado · tres columnas + Lo esencial', pie: 'Tres colegios, columnas de ancho igual y el toggle «solo diferencias».' },
      { url: scCompCuerpo, alt: 'Comparación en móvil: cuerpo de la tabla con trayectoria universitaria', ratio: '390 / 845', recorte: 'Cuerpo de tabla · trayectoria universitaria', pie: 'Prototipo: la estructura está resuelta y se implementa con el nuevo dataset.' },
    ],
  },
];

type CapaVal = {
  n: string;
  titulo: string;
  estado: string;
  tinta: string;
  borde: string;
  muestra: string;
  ancho: string;
  tono: string;
  texto: string;
  porque: string;
};

const VALIDACION: CapaVal[] = [
  {
    n: 'Capa 01', titulo: 'Testeo temprano cerrado', estado: 'Cerrada', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    muestra: '3 familias', ancho: '12%', tono: '#2166ac',
    texto: 'Tres sesiones tempranas con familias sobre un proto-prototipo que ya no se parece al producto actual. Sirvieron para descartar rumbo, no para validar pantallas.',
    porque: 'Validar iteraciones intermedias produce ruido —falsos positivos por novedad, falsos negativos por incompletitud— y ese ruido habría contaminado las cinco decisiones fuertes que vinieron después.',
  },
  {
    n: 'Capa 02', titulo: 'Auditoría heurística antes del testeo real', estado: 'En curso', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    muestra: 'Métodos, no personas', ancho: '38%', tono: '#4393c3',
    texto: 'Contraste y objetivos táctiles cerrados en WCAG 2.2 AA, heurísticas de Nielsen sobre el recorrido completo, arquitectura de información revisada, un solo nombre para cada cosa —«colegios similares» en todas las pantallas— y documentado qué información se muestra de entrada y qué queda un toque más adentro.',
    porque: 'Lo que un método conocido puede encontrar no se le pregunta a una familia. Hacerle gastar una sesión en un problema que una heurística detecta sola es gastar su tiempo y el mío.',
  },
  {
    n: 'Capa 03', titulo: 'Testeo real al lanzamiento', estado: 'nov-2026', tinta: '#8a1a20', borde: 'rgba(178,24,31,0.44)',
    muestra: 'Muestra amplia y orgánica', ancho: '100%', tono: '#b2181f',
    texto: 'La distribución está garantizada: Israel publica sobre educación chilena para una audiencia directa de familias buscando colegio. El lanzamiento es el testeo.',
    porque: 'La iteración se hace desde uso real y no desde tareas de laboratorio. Testear tarde con distribución real es mejor apuesta que testear temprano con muestra fabricada: es costo-oportunidad, no excusa.',
  },
];

type Hito = { fase: string; estado: string; detalle: string; tono: string };

const HITOS: Hito[] = [
  { fase: 'MVP Pudahuel', estado: 'Hecho', detalle: '57 colegios desplegados en Vercel y diseño móvil terminado. Construido punta a punta, del cruce de datos a la última pantalla.', tono: '#2166ac' },
  { fase: 'Sistema de diseño', estado: 'Hecho', detalle: 'Tokens corregidos a WCAG 2.2 AA, documento navegable y JSON en formato W3C DTCG.', tono: '#4393c3' },
  { fase: 'Schema nacional', estado: 'En curso', detalle: '340 campos declarados por prioridad; el dataset de 7.168 colegios se arma con Israel.', tono: '#d6604d' },
  { fase: 'Publicación', estado: 'nov-2026', detalle: 'Salida como observatorio abierto de trayectorias escolares.', tono: '#b2181f' },
  { fase: 'Observatorio', estado: 'Después', detalle: 'Crecer y refinarse con uso real, sin esperar a estar perfecto para salir.', tono: '#8a1a20' },
];

// ─── COMPONENTE ────────────────────────────────────────────────────────────

export default function EdubigCaseStudy({ onBack }: { onBack: () => void }) {
  const [pi, setPi] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // Mismo motor de progreso/scroll que ProjectDetail — navegador consistente.
  useEffect(() => {
    function onScroll() {
      const el = contentRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.max(0, Math.min(1, -top / scrollable)) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Autoplay al entrar en viewport, silenciado — política de navegadores.
  useEffect(() => {
    const vids = [video1Ref.current, video2Ref.current].filter(Boolean) as HTMLVideoElement[];
    if (!vids.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.5 },
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  function handleSeek(ratio: number, dragging = false) {
    const el = contentRef.current;
    if (!el) return;
    const scrollable = el.getBoundingClientRect().height - window.innerHeight;
    if (scrollable > 0) {
      window.scrollTo({ top: el.offsetTop + ratio * scrollable, behavior: dragging ? 'auto' : 'smooth' });
    }
  }

  const persona = PERSONAS[pi];

  return (
    <div className="eb bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      {/* Regla vertical — misma navegación que el resto de los proyectos */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(13)} />
      </div>

      <div ref={contentRef} className="eb-content">
        <div className="eb-topbar">
          <BackButton onClick={onBack} label="Volver al listado" />
          <span className="eb-cat-chip" aria-label="Categoría UX-UI">
            <span className="eb-cat-dot" />UX-UI
          </span>
        </div>

        {/* ─── STAGE 01 · COVER ───────────────────────────────────────── */}
        <section id="eb-stage-01" className="eb-stage">
          <StageHead n="01" title="Cover" step="01 / 11" />
          <div className="eb-cover">
            <div className="eb-cover-txt">
              <p className="eb-hook-a">
                En Chile, cada colegio queda descrito en seis portales oficiales que no dialogan entre sí.
              </p>
              <h1 className="eb-hook-b">eduBIG los traduce a una decisión.</h1>

              <div className="eb-filete">
                <div className="eb-filete-bar" />
                <div className="eb-filete-row">
                  <span>Dato frío</span><span>Puente</span><span>Familia</span>
                </div>
              </div>

              <p className="eb-lead">
                Plataforma abierta de datos escolares para familias chilenas. Comparar, recomendar y explorar
                colegios con el contexto que hace legible cada dato: los indicadores se leen contra colegios
                parecidos y la metodología queda a la vista. En construcción; lanzamiento apuntado a noviembre
                de 2026.
              </p>

              <dl className="eb-meta">
                <div><dt>Rol</dt><dd>MVP completo — dato, diseño, producto y sistema</dd></div>
                <div><dt>Colaboración</dt><dd>Israel Rubilar — dataset nacional, desde la fase de escala</dd></div>
                <div><dt>Estado</dt><dd>En construcción · <span className="mono">nov-2026</span></dd></div>
                <div><dt>Escala</dt><dd><span className="mono">57</span> colegios validados <span className="arrow">→</span> <span className="mono">7.168</span> en schema</dd></div>
              </dl>
            </div>

            <figure className="eb-fig">
              <div className="eb-frame eb-frame-logo">
                <img src={logo} alt="Isologo eduBIG: dos cápsulas superpuestas, 011 en pixel sobre azul y eB sobre rojo" />
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 01 · Isologo</span>
                <p>
                  Dos cápsulas superpuestas dibujadas como los dos estados de un toggle.{' '}
                  <span className="mono cold">011</span> en Pixelify Sans es el dato tal como sale de la
                  máquina: frío, binario, ilegible para cualquiera.{' '}
                  <span className="mono warm">eB</span> en Work Sans es lo que la familia recibe. La forma
                  del logo es el concepto.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ─── STAGE 02 · LA PREGUNTA ─────────────────────────────────── */}
        <section id="eb-stage-02" className="eb-stage">
          <StageHead n="02" title="La pregunta" step="02 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Una familia elige el colegio de su hijo. A su alcance hay seis fuentes oficiales: directorio
                Mineduc, SIMCE y IDPS de la Agencia de Calidad, denuncias Supereduc, geolocalización, PAES.
                Casi ninguna familia las abre, y las que lo hacen encuentran datos que nadie les explicó
                cómo leer.
              </p>
              <p className="p-soft">
                El problema no es la falta de información. Es la distancia entre el dato oficial y la
                pregunta real de una familia: <em>¿este colegio es un buen lugar para mi hijo?</em>
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">La decisión de eduBIG fue no construir un séptimo portal. Tampoco un ranking. Un traductor.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-fuentes-grid">
                <div className="eb-fuentes-col">
                  <div className="eb-fuentes-line" />
                  <span className="eb-col-label">Entrada · seis fuentes oficiales</span>
                  {FUENTES.map((f) => (
                    <div className="eb-fuente-row" key={f.n}>
                      <span className="eb-fnum">{f.n}</span>
                      <span className="eb-fbody">
                        <span className="eb-fnombre">{f.nombre}</span>
                        <span className="eb-fdet">{f.detalle}</span>
                      </span>
                      <span className="eb-fbar" style={{ background: f.tono }} />
                    </div>
                  ))}
                  <div className="eb-fuentes-end" />
                </div>

                <div className="eb-fuentes-mid">
                  <div className="eb-fuentes-conn" />
                  <div className="eb-fuentes-node">
                    <img src={logo} alt="Isologo eduBIG" />
                  </div>
                </div>

                <div className="eb-fuentes-out">
                  <span className="eb-col-label">Salida · una conclusión legible</span>
                  <img src={tarjeta} alt="TarjetaColegio de eduBIG: Colegio Alexander Graham Bell, educación pública, básica, a 850 m, con etiquetas gratuito, programa PIE, SIMCE sobre su GSE, convivencia alta y sin denuncias" className="eb-tarjeta" />
                  <span className="eb-fdet" style={{ maxWidth: 276 }}>Etiquetas contextuales, no puntaje. Comparado contra su grupo GSE; metodología pública.</span>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 02 · Seis entradas, una salida</span>
              <p>
                Las seis fuentes no se suman ni se promedian en un puntaje: se cruzan y salen como la{' '}
                <span className="mono">TarjetaColegio</span> del producto — <em>SIMCE sobre su GSE</em>,{' '}
                <em>convivencia alta</em>, <em>a 850 m de tu casa</em>. El nodo del medio no es un motor
                de ranking: es el punto donde el mismo dato se dice de otra manera.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 03 · ROL Y FORMA DE TRABAJAR ─────────────────────── */}
        <section id="eb-stage-03" className="eb-stage">
          <StageHead n="03" title="Rol y forma de trabajar" step="03 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Dirección de diseño, producto y sistema — y en el MVP también la ingeniería de datos: lo
                construí entero yo, del cruce de los seis datasets a la última pantalla. Israel Rubilar,
                analista institucional que publica sobre educación en Chile con alcance directo a familias,
                entró después de ver el MVP funcionando: con él decidimos escalar a todo Chile, y desde ahí
                él construye el dataset nacional sobre la estructura que yo defino.
              </p>
              <p className="p-soft">
                La IA trabaja como colaborador dirigido, no como reemplazo. Lo que le toca hacer cambia en
                cada capa del proyecto.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Cada capa registra qué se dirigió, qué se generó y cómo se validó.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame" style={{ padding: '8px 34px 34px' }}>
              {CAPAS.map((c) => (
                <div className="eb-capa-row" key={c.n}>
                  <div className="eb-capa-l">
                    <div className="eb-capa-head">
                      <span className="mono small">{c.n}</span>
                      <span className="eb-capa-name">{c.capa}</span>
                    </div>
                    <span className="eb-capa-stack">{c.stack}</span>
                    <span className="eb-capa-modo">{c.modo}</span>
                  </div>
                  <div className="eb-capa-r">
                    {c.registro.map(([k, v]) => (
                      <div className="eb-capa-reg" key={k}>
                        <span className="eb-reg-k">{k}</span>
                        <span className="eb-reg-v">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 03 · Cuatro capas, cuatro modos de dirigir</span>
              <p>
                El modo no es una preferencia de trabajo: lo fija cuánto costaría equivocarse en esa capa.
                Un error en el pipeline ensucia el dato de 7.168 colegios y llega hasta la ficha; un error
                de frontend se ve y se corrige en el momento. En Figma la IA sirve para tirar wireframes de
                arranque y descartar caminos sin gastar mucho, pero el diseño que queda es el que trabajé
                encima — y es ese archivo el que implementa el frontend, no una descripción. La capa de
                sistema es la única donde la IA revisa mi trabajo y no al revés: de ahí sale la auditoría
                de la <span className="mono">08.2</span>.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 04 · INVESTIGACIÓN ───────────────────────────────── */}
        <section id="eb-stage-04" className="eb-stage">
          <StageHead n="04" title="Investigación" step="04 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Tres personas construidas sobre evidencia: informes del BID, datos de la Agencia de Calidad
                y denuncias de la Supereduc. Ninguna salió de mi cabeza.
              </p>
              <p className="p-soft">
                De las tres aparecen cinco dolores que se repiten. El más grave no es de usabilidad ni de
                acceso: es de idioma.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">El dato existe, pero no habla el idioma de la decisión familiar.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame" style={{ padding: '26px 30px 30px' }}>
              <div className="eb-persona-tabs" role="tablist" aria-label="Personas">
                {PERSONAS.map((p, i) => (
                  <button
                    key={p.n}
                    type="button"
                    role="tab"
                    aria-selected={i === pi}
                    onClick={() => setPi(i)}
                    className={'eb-persona-tab' + (i === pi ? ' is-active' : '')}
                  >
                    <span className="eb-persona-tabn">{p.n}</span>
                    <span className="eb-persona-tabnombre">{p.nombre}</span>
                  </button>
                ))}
              </div>

              <div className="eb-persona-body">
                <div className="eb-persona-l">
                  <div
                    role="img"
                    aria-label={`Retrato de persona: ${persona.nombre}`}
                    className="eb-persona-retrato"
                    style={{ backgroundImage: `url(${persona.retrato})` }}
                  />
                  <dl className="eb-persona-meta">
                    {persona.meta.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt><dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="eb-persona-r">
                  <div className="eb-persona-title">
                    <span className="mono uc small dim">{persona.comuna} · {persona.perfil}</span>
                    <h3>{persona.nombre}</h3>
                  </div>

                  <blockquote className="eb-persona-quote">
                    <p>{persona.cita}</p>
                  </blockquote>

                  <div className="eb-persona-dolores">
                    <div className="eb-dolor-head">
                      <span>Dolor</span><span>Severidad</span>
                    </div>
                    {persona.dolores.map((d, i) => (
                      <div className="eb-dolor-row" key={i}>
                        <span className="eb-dolor-txt">{d.dolor}</span>
                        <span className="eb-dolor-sev">
                          <span className="eb-dolor-sev-n">{d.sev}</span>
                          <span className="eb-dolor-efecto">{d.efecto}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="eb-persona-implic">
                    <span className="mono uc small dim">Implicaciones para el diseño</span>
                    {persona.implicaciones.map((i, k) => (
                      <div className="eb-implic-row" key={k}>
                        <span className="eb-implic-dot" />
                        <span>{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 04 · Tres personas, una card intercambiable</span>
              <p>
                Cada dolor viene con severidad y con el efecto que produce, porque eso es lo que ordenó
                la prioridad: los dos críticos de Carolina — no entiende las siglas, no tiene computador —
                son los que fijaron mobile-first y lenguaje simple antes que cualquier funcionalidad.
                Carolina y Francisca llegan al mismo requisito desde extremos opuestos del eje
                socioeconómico: una no puede leer un puntaje, la otra no confía en uno sin contexto. Las
                dos piden lo mismo — comparación contra colegios equivalentes — y esa coincidencia es la
                que sostiene las decisiones 1 y 4.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 05 · CONCEPTO RECTOR ─────────────────────────────── */}
        <section id="eb-stage-05" className="eb-stage">
          <StageHead n="05" title="Concepto rector" step="05 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                El concepto rector es <strong>un sistema que se traduce en cuidado.</strong>
              </p>
              <p className="p-soft">
                Su base es una idea de Hofstadter en <em>Gödel, Escher, Bach</em>: una traducción es fiel
                cuando conserva la estructura de lo que traduce, aunque cambie por completo el material.
                En eduBIG eso se ve en dos cadenas de tres pasos que tienen la misma forma, una del lado
                del dato y otra del lado de la familia.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                eduBIG es el puente: conserva la estructura del dato y cambia el material por algo que
                una familia puede usar.
              </p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-eslab-head">
                <span>
                  <span className="mono uc small">Dato</span>
                  <span className="eb-eslab-sub">Cadena fría</span>
                </span>
                <span className="eb-eslab-mid">
                  <span className="mono uc small">Puente</span>
                  <span className="eb-eslab-sub">Posición</span>
                </span>
                <span>
                  <span className="mono uc small">Familia</span>
                  <span className="eb-eslab-sub">Cadena cálida</span>
                </span>
              </div>
              {ESLABONES.map((e) => (
                <div className="eb-eslab-row" key={e.n}>
                  <div className="eb-eslab-cold">
                    <span className="eb-eslab-key">{e.frio}</span>
                    <span className="eb-eslab-gloss">{e.frioGloss}</span>
                  </div>
                  <div className="eb-eslab-mid-col">
                    <span className="mono small dim">{e.n}</span>
                    <span className="eb-eslab-line" />
                    <span className="eb-eslab-rol">{e.rol}</span>
                  </div>
                  <div className="eb-eslab-warm">
                    <span className="eb-eslab-key">{e.calido}</span>
                    <span className="eb-eslab-gloss">{e.calidoGloss}</span>
                  </div>
                </div>
              ))}
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 05 · Dos cadenas, la misma estructura</span>
              <p>
                Las dos cadenas se leen en paralelo porque tienen la misma forma, no porque signifiquen lo
                mismo: tres eslabones, un origen, un término medio incómodo y un resultado. Eso es lo que
                la traducción preserva. La posición 2 es la prueba: <em>frío</em> y <em>preocupación</em>{' '}
                son los dos eslabones que un producto amable borraría, y son justamente los que sostienen{' '}
                <em>honesto</em> y <em>seguridad</em>.
              </p>
            </figcaption>
          </figure>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-logo-beat">
                <span className="mono uc small dim">01 · Boceto</span>
                <div className="eb-logo-box"><img src={bocetoToggle} alt="Board manuscrito del proceso: traducción de dato frío a dato cálido, bocetos de toggle" /></div>
                <p className="eb-logo-desc">
                  El board parte de <em>dato frío → dato cálido</em> y llega a la pregunta anotada al
                  margen: «¿toggles, switches?». La metáfora no se buscó para el logo; apareció buscando
                  cómo dibujar la traducción, y trae ya el vocabulario entero — la paleta frío→cálido como
                  puente, el <em>switch off</em> como dato crudo, el <em>on</em> como dato traducido.
                </p>
              </div>

              <div className="eb-logo-beat divider">
                <span className="mono uc small dim">02 · Formalización</span>
                <div className="eb-logo-box"><img src={formalizacionLogo} alt="Formalización del logo: retícula de construcción del toggle en estados ON y OFF junto al isologo resultante" /></div>
                <p className="eb-logo-desc">
                  El toggle real se desarma en retícula: dos estados, un radio, un eje. La marca hereda
                  esa construcción exacta — misma cápsula, mismo círculo desplazado, mismas tangentes —
                  en lugar de imitar su apariencia. A la derecha, la retícula vacía y el isologo ocupando
                  el mismo lugar que ocupaba el control.
                </p>
              </div>

              <div className="eb-logo-final">
                <div className="eb-logo-final-box"><img src={logo} alt="Isologo eduBIG final" /></div>
                <div className="eb-logo-final-txt">
                  <span className="mono uc small dim">03 · Isologo</span>
                  <p>
                    Dos cápsulas superpuestas: <span className="mono cold">011</span> en Pixelify Sans es
                    lenguaje de máquina — el grado cero del dato — y{' '}
                    <span className="mono warm">eB</span> en Work Sans es lo que la familia recibe. El
                    gradiente entre ambas no es un efecto: es el eje RdBu completo, el mismo que después
                    ordena los módulos del producto.
                  </p>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 06 · Del gesto a la marca</span>
              <p>
                El isologo no ilustra el concepto: lo ejecuta. Un toggle es el único objeto de interfaz
                cuyo significado es exactamente «el mismo sistema, dos estados», que es la definición
                operativa de una traducción fiel — cambia el material, se preserva la estructura. Por eso
                el binario queda en la cápsula fría y la sigla legible en la cálida, y no al revés. La
                forma del logo es el concepto.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 06 · CINCO DECISIONES ────────────────────────────── */}
        <section id="eb-stage-06" className="eb-stage">
          <StageHead n="06" title="Cinco decisiones" step="06 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Cinco decisiones de diseño, cada una con su tensión, su resolución y su costo. Ninguna es
                gratis: las cinco renuncian a algo que un producto más vendible conservaría.
              </p>
              <p className="p-soft">
                Las cinco derivan del mismo criterio: cuando la legibilidad y la honestidad entran en
                conflicto, gana la honestidad — pero la carga de hacerla legible es del producto, no de
                la familia.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Un producto sin costos declarados no tomó decisiones: tomó defaults.</p>
            </div>
          </div>

          <div className="eb-decisiones">
            {DECISIONES.map((d) => (
              <div className="eb-decision" key={d.n}>
                <div className="eb-dec-l">
                  <div className="eb-dec-head">
                    <span className="mono small dim">{d.n}</span>
                    <h3>{d.titulo}</h3>
                  </div>
                  <span className="eb-dec-tag">{d.ambito}</span>
                </div>
                <div className="eb-dec-r">
                  <div className="eb-dec-row">
                    <span className="eb-dec-k dim">Tensión</span>
                    <span className="eb-dec-v soft">{d.tension}</span>
                  </div>
                  <div className="eb-dec-row hilite">
                    <span className="eb-dec-k">Resolución</span>
                    <span className="eb-dec-v">{d.resolucion}</span>
                  </div>
                  <div className="eb-dec-row hilite">
                    <span className="eb-dec-k warn">Costo</span>
                    <span className="eb-dec-v soft">{d.costo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-dim-head">
                <span className="mono uc small">Dimensión IDPS</span>
                <span className="mono uc small">Colegios similares</span>
                <span className="mono uc small">Graham Bell · 8° básico</span>
              </div>
              {DIMENSIONES.map((s) => (
                <div className="eb-dim-row" key={s.nombre}>
                  <span className="eb-dim-name">
                    <span className="mono">{s.nombre}</span>
                    <span className="eb-dim-que">{s.que}</span>
                  </span>
                  <span className="eb-dim-bar">
                    <span className="eb-dim-fill grey" style={{ width: s.anchoColapso }} />
                    <span className="mono small dim">{s.colapso}</span>
                  </span>
                  <span className="eb-dim-bar">
                    <span className="eb-dim-fill dark" style={{ width: s.ancho }} />
                    <span className="mono small">{s.valor}</span>
                    <span className="mono small dim">{s.delta}</span>
                  </span>
                </div>
              ))}
              <div className="eb-dim-total">
                <span className="eb-dim-total-l">Colapsado en un score único</span>
                <span className="eb-dim-bar"><span className="eb-dim-fill grey" style={{ width: '74.8%' }} /><span className="mono small dim">74,8</span></span>
                <span className="eb-dim-bar"><span className="eb-dim-fill grey" style={{ width: '70.3%' }} /><span className="mono small dim">70,3</span></span>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 07 · Por qué las cuatro series no se promedian</span>
              <p>
                Datos reales de la ficha de Graham Bell, IDPS 8° básico 2025 preliminar. Colapsadas, las
                cuatro dimensiones dan <span className="mono">70,3</span> contra{' '}
                <span className="mono">74,8</span> de sus pares: «algo bajo», y nada más. Separadas se
                ve lo que el promedio no puede decir: las cuatro brechas son casi idénticas —{' '}
                <span className="mono">−5, −4, −4, −5</span> —, o sea un colegio parejo un poco por
                debajo de sus pares, no uno con un área hundida. Ese mismo{' '}
                <span className="mono">70,3</span> lo produciría también un colegio con tres dimensiones
                altas y una colapsada, que para una familia es una decisión completamente distinta. Las
                barras van en tinta neutra a propósito: acá el color no codifica nada, y el eje frío–cálido
                está reservado para otra pregunta.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 07 · INGENIERÍA DEL DATO ─────────────────────────── */}
        <section id="eb-stage-07" className="eb-stage">
          <StageHead n="07" title="Ingeniería del dato" step="07 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Un pipeline en Python y Pandas cruza los seis datasets oficiales en un{' '}
                <strong>único JSON maestro.</strong> El MVP lo construí yo entero: el cruce, el JSON, el
                diseño y el producto. 57 colegios de Pudahuel, punta a punta.
              </p>
              <p className="p-soft">
                Israel entró después, al ver el MVP funcionando. En esa reunión decidimos escalarlo a todo
                Chile — 7.168 colegios de básica — y ahí aparece el nuevo dataset nacional. El cambio de
                escala es lo que obliga a cambiar de método.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                Definir el schema es diseño: decide qué se va a poder decir de un colegio antes de que
                exista el dato.
              </p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-scale">
                <div className="eb-scale-col">
                  <span className="mono uc small dim">MVP · una persona, 57 colegios</span>
                  <span className="eb-scale-title">El dato y el diseño en la misma cabeza</span>
                  <span className="eb-scale-desc">Cruzar los datasets a mano funcionaba porque quien los cruzaba era quien dibujaba la ficha. No había contrato que escribir: el schema vivía en mi cabeza y cambiaba conmigo.</span>
                </div>
                <div className="eb-scale-col warm">
                  <span className="mono uc small dim">Escala · dos personas, 7.168 colegios</span>
                  <span className="eb-scale-title">eduBIG declara 340 campos, Israel los rellena</span>
                  <span className="eb-scale-desc">A escala nacional el dato ya no lo levanto yo, así que el schema tiene que estar escrito y priorizado antes de pedirlo. El contrato reemplaza a la coordinación informal.</span>
                </div>
              </div>

              <div className="eb-p-grid">
                <div className="eb-p-col" style={{ borderTop: '3px solid #2166ac' }}>
                  <span className="mono">P0</span>
                  <span>Sin esto no hay ficha: RBD, dependencia, copago, nivel, ubicación.</span>
                </div>
                <div className="eb-p-col" style={{ borderTop: '3px solid #4393c3' }}>
                  <span className="mono">P1</span>
                  <span>Sin esto no hay traducción: series SIMCE e IDPS contra grupo GSE.</span>
                </div>
                <div className="eb-p-col" style={{ borderTop: '3px solid #d1e5f0' }}>
                  <span className="mono">P2</span>
                  <span>Enriquecen la ficha cuando estén: PAES, proyecto educativo, talleres.</span>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 08 · Del MVP a la escala nacional</span>
              <p>
                La prioridad no ordena el pedido por comodidad: ordena qué puede prometer el producto en
                cada etapa. P0 habilita la ficha, P1 habilita el Test de Calce — sin series contra grupo
                GSE no hay calce que calcular — y P2 es todo lo que puede faltar sin que la decisión de la
                familia se degrade. Escribir esa jerarquía fue posible porque el MVP ya había hecho el
                recorrido completo a mano.
              </p>
            </figcaption>
          </figure>

          <figure className="eb-fig">
            <div className="eb-videoframe">
              <video ref={video1Ref} src="/edubig-proceso-datos.mp4" muted controls playsInline preload="metadata" />
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 09 · El co-work sobre el pipeline</span>
              <p>
                En el video se ve cómo trabajé el pipeline junto a la IA: yo decido qué dato se cruza con
                qué y en qué orden, la IA escribe el código, y después reviso cada resultado contra la
                fuente oficial. Si un campo queda mal cruzado se nota enseguida en la ficha del colegio,
                así que el error sale a la superficie y se arregla barato. Por eso acá puedo delegar la
                escritura sin delegar la decisión.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 08 · INFRAESTRUCTURA Y ACCESIBILIDAD ─────────────── */}
        <section id="eb-stage-08" className="eb-stage">
          <StageHead n="08" title="Infraestructura y accesibilidad" step="08 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Migrar al schema nacional depende del nuevo dataset, que se está armando y tiene su propio
                calendario. <strong>Esa ventana de espera es el momento correcto</strong> para hacer el
                trabajo de sistema que antes no correspondía.
              </p>
              <p className="p-soft">
                El diseño se había hecho en Figma como un dibujo: componentes mínimos, criterios repetidos
                por convención, sin sistema formalizado. Formalizarlo antes de saber si la propuesta
                resistía habría sido inversión prematura. El MVP ya la validó.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                Se entrega de dos formas: un documento navegable para leerlo y un JSON en formato W3C DTCG
                para volver a Figma con Tokens Studio.
              </p>
            </div>
          </div>

          {/* 08.1 · Las dos paletas */}
          <div className="eb-substage">
            <span className="mono small uc bold">08.1 · Las dos paletas</span>
          </div>
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                El sistema tiene dos paletas y no se mezclan. La primera viene de RdBu (ColorBrewer) y no
                clasifica colegios: dice <strong>en qué punto de la traducción está lo que estás
                mirando.</strong> Frío es dato crudo; cálido es dato ya traducido a lo que la familia
                necesita.
              </p>
              <p className="p-soft">
                La segunda es para gráficos de categorías que no tienen orden: universidades de destino,
                áreas de carrera, niveles Alto / Medio / Bajo. Si usáramos el eje frío–cálido ahí, estaría
                diciendo algo que no es cierto.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                La temperatura no es un estilo: es una variable con significado, y por eso tiene prohibido
                usarse para otra cosa.
              </p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-pals">
                <div className="eb-pal-col">
                  <div className="eb-pal-title">
                    <span className="mono uc small">Paleta 01 · Eje de traducción</span>
                    <span className="eb-pal-sub">RdBu — ColorBrewer. Ordinal y con dirección.</span>
                  </div>
                  <div className="eb-pal-bar" style={{ background: 'linear-gradient(90deg,#053061,#2166ac,#4393c3,#d1e5f0,#f7f7f7,#fddbc7,#f4a582,#d6604d,#b2181f)' }} />
                  <div className="eb-pal-list">
                    {USOS_EJE.map((u, i) => (
                      <div className="eb-pal-row" key={i}>
                        <span className="eb-pal-swatch" style={{ background: u.tono }} />
                        <span className="eb-pal-txt">
                          <span>{u.estado}</span>
                          <span className="dim">{u.donde}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="eb-pal-col">
                  <div className="eb-pal-title">
                    <span className="mono uc small">Paleta 02 · Visualización cualitativa</span>
                    <span className="eb-pal-sub">Categórica: sin orden ni dirección. Los tonos están tomados de los frames y todavía faltan fijarlos como token.</span>
                  </div>
                  <div className="eb-pal-bar-cat">
                    <span style={{ background: '#2f7d32' }} />
                    <span style={{ background: '#2b4fc4' }} />
                    <span style={{ background: '#c0392b' }} />
                    <span style={{ background: '#7b52c9' }} />
                    <span style={{ background: '#5a5a55' }} />
                  </div>
                  <div className="eb-pal-list">
                    {USOS_CUAL.map((u, i) => (
                      <div className="eb-pal-row" key={i}>
                        <span className="eb-pal-swatch" style={{ background: u.tono }} />
                        <span className="eb-pal-txt">
                          <span>{u.estado}</span>
                          <span className="dim">{u.donde}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="eb-pal-rules">
                <div>
                  <span className="mono uc small dim">Regla única</span>
                  <span>Si el color responde «¿qué tan traducido está esto?», es RdBu. Si responde «¿cuál de estos es?», es cualitativa.</span>
                </div>
                <div>
                  <span className="mono uc small dim">Interactivo</span>
                  <span><span className="mono" style={{ color: '#0958D9' }}>#0958D9</span> queda fuera de ambas. Es affordance, no significado: botón, foco, enlace.</span>
                </div>
                <div>
                  <span className="mono uc small dim">Tercer encoding</span>
                  <span>Las chips Alto / Medio / Bajo de la comparación usan verde–ámbar–rojo, que es semántica de evaluación y no pertenece a ninguna de las dos paletas.</span>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 10 · Dos paletas, dos preguntas distintas</span>
              <p>
                Separarlas no es purismo: es lo que permite que el eje frío–cálido siga significando algo.
                Si las chips de comparación usaran RdBu, un colegio «Bajo» se leería como un dato más
                traducido en vez de como una categoría, y el único recurso que carga el concepto rector
                quedaría gastado en clasificar.
              </p>
            </figcaption>
          </figure>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-frames-trad">
                {FRAMES_TRAD.map((f, i) => (
                  <div className="eb-frame-t" key={i}>
                    <div className="eb-frame-t-head">
                      <span className="eb-frame-t-dot" style={{ background: f.tono }} />
                      <span className="mono uc small">{f.estado}</span>
                    </div>
                    <div
                      role="img"
                      aria-label={f.alt}
                      className="eb-frame-t-img"
                      style={{ backgroundImage: `url(${f.url})` }}
                    />
                    <span className="mono uc small dim">{f.recorte}</span>
                    <p className="eb-frame-t-nota">{f.nota}</p>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 11 · La misma card, dos temperaturas</span>
              <p>
                La prueba de que el eje es estado y no estilo: es el mismo componente de card en las dos
                puntas, y su temperatura cambia sola con el origen del dato. Frío cuando lo encontraste
                vos navegando una lista; cálido cuando el sistema lo trajo para tu familia — y recién ahí
                aparecen las chips de calce y las acciones, porque hay contra qué contrastarlo. En el
                medio, la pantalla de espera dice literalmente <em>Traduciendo tus respuestas</em> — el
                concepto rector no aparece en un manifiesto sino en el microcopy de un loader.
              </p>
            </figcaption>
          </figure>

          {/* 08.2 · Auditoría WCAG */}
          <div className="eb-substage">
            <span className="mono small uc bold">08.2 · Auditoría WCAG 2.2 AA</span>
          </div>
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Revisé los colores del producto contra WCAG 2.2 AA. Es la única parte del proyecto donde
                la IA revisa mi trabajo y no al revés: yo definí qué se auditaba, ella pasó el criterio
                por cada token y después verifiqué los ratios uno por uno.
              </p>
              <p className="p-soft">
                Carolina decide desde el teléfono, con datos móviles, en la calle. Un contraste que falla
                no es una infracción formal: es un dato que no se lee.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                La auditoría encontró dos tokens que el propio sistema usaba mal. Los dos son cálidos.
              </p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-contraste-head">
                <span className="mono uc small">Token</span>
                <span className="mono uc small">Uso en el producto</span>
                <span className="mono uc small right">Ratio</span>
                <span className="mono uc small">Veredicto</span>
              </div>
              {CONTRASTE.map((c) => (
                <div className="eb-contraste-row" key={c.hex}>
                  <span className="eb-contraste-hex">
                    <span className="eb-contraste-chip" style={{ background: c.hex }} />
                    <span className="mono small">{c.hex}</span>
                  </span>
                  <span className="eb-contraste-uso">{c.uso}</span>
                  <span className="mono right">{c.ratio}</span>
                  <span className="eb-contraste-verd">
                    <span className="eb-contraste-dot" style={{ background: c.marca }} />
                    <span style={{ color: c.tintaVeredicto }}>{c.veredicto}</span>
                  </span>
                </div>
              ))}
              <span className="eb-contraste-nota">
                Ratios calculados contra <span className="mono small">#FFFFFF</span>, superficie real de
                card y ficha. Umbrales WCAG 2.2: 4,5:1 texto normal · 3:1 texto grande y elementos no
                textuales.
              </span>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 12 · Auditoría de contraste sobre los tokens</span>
              <p>
                El hallazgo incómodo: el lado cálido del eje es el más débil.{' '}
                <span className="mono">#f4a582</span> no alcanza ni el umbral no textual, y era exactamente
                el token del borde en hover — el estado que la <span className="mono">08.1</span> presenta,
                más arriba en esta misma stage, como el momento en que el dato cruza a cálido. El concepto
                rector dependía de un contraste que no existía.
              </p>
            </figcaption>
          </figure>

          <div className="eb-criterios">
            {CRITERIOS.map((k) => (
              <div className="eb-criterio" key={k.sc}>
                <div className="eb-crit-l">
                  <span className="mono small dim">{k.sc}</span>
                  <span className="eb-crit-name">{k.nombre}</span>
                  <span
                    className="eb-crit-tag"
                    style={{ color: k.tinta, borderColor: k.borde }}
                  >{k.estado}</span>
                </div>
                <div className="eb-crit-r">
                  <div className="eb-crit-row">
                    <span className="eb-crit-k dim">Riesgo</span>
                    <span className="eb-crit-v soft">{k.riesgo}</span>
                  </div>
                  <div className="eb-crit-row hilite">
                    <span className="eb-crit-k">Respuesta</span>
                    <span className="eb-crit-v">{k.respuesta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STAGE 09 · EL PRODUCTO ─────────────────────────────────── */}
        <section id="eb-stage-09" className="eb-stage">
          <StageHead n="09" title="El producto" step="09 / 11" />
          <div className="eb-prod-intro">
            <figure className="eb-fig eb-prod-video">
              <div className="eb-videoframe">
                <video ref={video2Ref} src="/edubig-navegacion-mvp.mp4" muted controls playsInline preload="metadata" />
              </div>
              <figcaption className="mono uc small dim">Fig. 13 · El recorrido completo, en movimiento</figcaption>
            </figure>
            <div className="eb-prod-intro-txt">
              <p className="p-strong">
                Las pantallas se recorren en <strong>orden narrativo, no por menú.</strong>
              </p>
              <p className="p-soft">
                Al margen de cada una queda anotada la decisión de las stages anteriores que ahí se vuelve
                visible. Sin esa anotación el screen no prueba nada: es una captura.
              </p>
              <div className="eb-recorrido">
                <span className="mono uc small dim">Recorrido por defecto</span>
                <span className="eb-recorrido-line">Home → Test de Calce → Traducción → Shortlist → Ficha</span>
              </div>
            </div>
          </div>

          <div className="eb-producto">
            {PRODUCTO.map((b) => (
              <div className="eb-prod-row" key={b.n}>
                <div className="eb-prod-l">
                  <div className="eb-prod-head">
                    <span className="mono small dim">{b.n}</span>
                    <span className="eb-prod-title">{b.titulo}</span>
                  </div>
                  <div className="eb-prod-tono" style={{ background: b.tono }} />
                  <div className="eb-prod-vienen">
                    <span className="mono uc small dim">Acá se manifiesta</span>
                    <div className="eb-prod-chips">
                      {b.vienen.map((v, i) => <span className="eb-prod-chip" key={i}>{v}</span>)}
                    </div>
                  </div>
                  <div className="eb-prod-notas">
                    {b.notas.map((n, i) => <p key={i}>{n}</p>)}
                  </div>
                </div>

                <div className="eb-prod-r">
                  <div className="eb-frame" style={{ padding: 26 }}>
                    <div className="eb-screens">
                      {b.screens.map((s, i) => (
                        <figure className="eb-screen" key={i}>
                          <div
                            role="img"
                            aria-label={s.alt}
                            className="eb-screen-img"
                            style={{ backgroundImage: `url(${s.url})`, aspectRatio: s.ratio }}
                          />
                          <span className="mono uc small dim">{s.recorte}</span>
                          <figcaption>{s.pie}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mono small dim eb-prod-footnote">
            Fig. 14 · Pantallas del producto en construcción, en ventanas recortadas a 390×845.
          </p>
        </section>

        {/* ─── STAGE 10 · MÉTODO DE VALIDACIÓN ────────────────────────── */}
        <section id="eb-stage-10" className="eb-stage">
          <StageHead n="10" title="Método de validación" step="10 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                La estrategia de validación es <strong>una decisión de secuencia, no una omisión.</strong>
              </p>
              <p className="p-soft">
                Tres capas, y cada una responde una pregunta distinta. La discusión no es cuánto se testó:
                es en qué orden conviene gastar la atención de una familia que está eligiendo colegio en
                plazos del SAE.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                Testear tarde con distribución real es mejor apuesta que testear temprano con muestra
                fabricada.
              </p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              {VALIDACION.map((c) => (
                <div className="eb-val-row" key={c.n}>
                  <div className="eb-val-l">
                    <span className="mono uc small dim">{c.n}</span>
                    <span className="eb-val-title">{c.titulo}</span>
                    <span className="eb-val-tag" style={{ color: c.tinta, borderColor: c.borde }}>{c.estado}</span>
                    <div className="eb-val-scale">
                      <span className="eb-val-bar" style={{ width: c.ancho, background: c.tono }} />
                      <span className="mono small dim">{c.muestra}</span>
                    </div>
                  </div>
                  <div className="eb-val-r">
                    <p className="eb-val-txt">{c.texto}</p>
                    <div className="eb-val-porque">
                      <span className="mono uc small dim">Por qué</span>
                      <span className="soft">{c.porque}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 15 · Tres capas, muestra creciente</span>
              <p>
                La barra crece porque la muestra crece, y crece justo donde el producto ya aguanta ser
                mirado. Las dos primeras capas existen para que la tercera no gaste su muestra en encontrar
                lo que un método conocido encuentra gratis.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 11 · ESTADO Y HORIZONTE ──────────────────────────── */}
        <section id="eb-stage-11" className="eb-stage last">
          <StageHead n="11" title="Estado y horizonte" step="11 / 11" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Hoy: diseño terminado en móvil, MVP desplegado con 57 colegios de Pudahuel, sistema de
                diseño formalizado y deck de portafolio cerrado en 19 slides. Los módulos de comparación
                avanzan como prototipo.
              </p>
              <p className="p-soft">
                Lo próximo: cerrar el schema nacional, migrar el pipeline y los tipos de datos, publicar
                como observatorio abierto de trayectorias escolares.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">
                El sitio nace con la premisa de crecer y refinarse después del lanzamiento, no de esperar
                a estar perfecto para salir.
              </p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-timeline-bar" />
              <div className="eb-timeline">
                {HITOS.map((h) => (
                  <div className="eb-hito" key={h.fase}>
                    <span className="eb-hito-dot" style={{ background: h.tono }} />
                    <span className="eb-hito-fase">{h.fase}</span>
                    <span className="mono uc small dim">{h.estado}</span>
                    <span className="eb-hito-det">{h.detalle}</span>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 16 · De Pudahuel al observatorio</span>
              <p>
                La línea de tiempo corre sobre el mismo eje frío→cálido que ordena el producto: empieza
                en el dato crudo de 57 colegios y termina en un observatorio que devuelve trayectorias
                a las familias. La escala cambia; la traducción es la misma.
              </p>
            </figcaption>
          </figure>

          <p className="eb-cierre">
            eduBIG no es un producto terminado. Es un sistema que aprende a traducir.
          </p>
        </section>
      </div>
    </div>
  );
}

// ─── PIEZAS AUXILIARES ────────────────────────────────────────────────────

function StageHead({ n, title, step }: { n: string; title: string; step: string }) {
  return (
    <div className="eb-stagehead">
      <span className="mono uc small bold">Stage {n} · {title}</span>
      <span className="mono uc small dim">{step}</span>
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────

const CSS = `
.eb{color:var(--eb-ink);
  --eb-ink:#1a1a18;--eb-body:#3d3d38;--eb-dim:#6b6b64;--eb-line:rgba(26,26,24,.16);--eb-line-soft:rgba(26,26,24,.12);
  --eb-cold-3:#053061;--eb-cold-2:#2166ac;--eb-cold-1:#4393c3;--eb-cold-0:#92c5de;
  --eb-warm-0:#fddbc7;--eb-warm-1:#f4a582;--eb-warm-2:#d6604d;--eb-warm-3:#b2181f;
  --eb-int:#0958D9;
  --eb-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --eb-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --eb-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;
  --eb-max:1180px;}
.eb *{box-sizing:border-box;}
.eb .eb-content{padding:32px 80px 96px 188px;}
@media(max-width:900px){.eb .eb-content{padding:24px 20px 60px;}}

/* topbar: back + chip de categoría */
.eb .eb-topbar{max-width:var(--eb-max);display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:36px;flex-wrap:wrap;}
.eb .eb-cat-chip{display:inline-flex;align-items:center;gap:8px;font-family:var(--eb-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a7a4a;border:1px solid rgba(95,143,95,.55);border-radius:2px;padding:6px 10px;}
.eb .eb-cat-dot{width:6px;height:6px;background:#5f8f5f;border-radius:50%;display:inline-block;}

/* utilidades tipográficas locales */
.eb .mono{font-family:var(--eb-mono);font-size:12.5px;}
.eb .mono.small{font-size:10px;letter-spacing:.1em;}
.eb .mono.uc{text-transform:uppercase;letter-spacing:.12em;}
.eb .mono.bold{font-family:var(--eb-mono-med);font-weight:600;}
.eb .mono.right{text-align:right;}
.eb .mono.cold{color:var(--eb-cold-2);}
.eb .mono.warm{color:var(--eb-warm-3);}
.eb .dim{color:var(--eb-dim);}
.eb .soft{color:var(--eb-body);}
.eb .arrow{color:var(--eb-dim);}

/* stage y encabezado */
.eb .eb-stage{max-width:var(--eb-max);padding:0 0 104px;}
.eb .eb-stage.last{padding-bottom:20px;}
.eb .eb-stagehead{display:flex;align-items:baseline;justify-content:space-between;gap:20px;border-top:1px solid var(--eb-ink);padding-top:12px;flex-wrap:wrap;}
.eb .eb-substage{margin:56px 0 0;border-top:1px solid var(--eb-ink);padding-top:12px;display:flex;align-items:baseline;gap:12px;}

/* layout de dos columnas (párrafos + pull) */
.eb .eb-two{display:flex;flex-wrap:wrap;gap:56px;align-items:flex-start;padding-top:48px;}
.eb .eb-two-l{flex:1 1 380px;display:flex;flex-direction:column;gap:22px;min-width:0;}
.eb .eb-two-r{flex:1 1 300px;min-width:0;border-left:1px solid var(--eb-line);padding-left:26px;}
.eb .p-strong{margin:0;font-family:var(--eb-sans);font-size:17px;line-height:1.62;color:var(--eb-ink);max-width:60ch;text-wrap:pretty;}
.eb .p-soft{margin:0;font-family:var(--eb-sans);font-size:17px;line-height:1.62;color:var(--eb-body);max-width:60ch;text-wrap:pretty;}
.eb .p-strong strong,.eb .p-soft strong{font-weight:600;color:var(--eb-ink);}
.eb .p-strong em,.eb .p-soft em{font-style:italic;color:var(--eb-ink);}
.eb .eb-pull{margin:0;font-family:var(--eb-mono-med);font-weight:500;font-size:clamp(17px,1.55vw,21px);line-height:1.44;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}

/* figuras: marco 1/4/4/1, caption debajo */
.eb .eb-fig{margin:56px 0 0;display:flex;flex-direction:column;gap:14px;}
.eb .eb-frame{border-style:solid;border-color:var(--eb-ink);border-width:1px 4px 4px 1px;background:#f7f7f7;padding:34px;box-sizing:border-box;overflow-x:auto;}
.eb .eb-fcap{display:flex;flex-direction:column;gap:9px;}
.eb .eb-figlabel{font-family:var(--eb-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-fcap p{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.58;color:var(--eb-body);max-width:74ch;text-wrap:pretty;}
.eb .eb-fcap p em{font-style:italic;color:var(--eb-ink);}

/* STAGE 01 · Cover */
.eb .eb-cover{display:flex;flex-wrap:wrap;gap:56px;align-items:flex-start;padding-top:56px;}
.eb .eb-cover-txt{flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-hook-a{margin:0;font-family:var(--eb-sans);font-weight:400;font-size:clamp(17px,1.8vw,23px);line-height:1.5;letter-spacing:0;color:var(--eb-body);text-wrap:pretty;max-width:34ch;}
.eb .eb-hook-b{margin:22px 0 0;font-family:var(--eb-mono-med);font-weight:600;font-size:clamp(32px,4.2vw,54px);line-height:1.12;letter-spacing:-.028em;color:#141412;text-wrap:pretty;max-width:16ch;}
.eb .eb-filete{margin:38px 0 0;display:flex;flex-direction:column;gap:7px;}
.eb .eb-filete-bar{height:5px;width:100%;max-width:560px;background:linear-gradient(90deg,#053061 0%,#2166ac 16%,#4393c3 30%,#d1e5f0 43%,#f7f7f7 50%,#fddbc7 60%,#f4a582 71%,#d6604d 85%,#b2181f 100%);}
.eb .eb-filete-row{display:flex;justify-content:space-between;max-width:560px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-lead{margin:40px 0 0;font-family:var(--eb-sans);font-size:17px;line-height:1.62;color:var(--eb-body);max-width:58ch;text-wrap:pretty;}
.eb .eb-meta{margin:44px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(176px,1fr));gap:22px 32px;border-top:1px solid var(--eb-line);padding-top:22px;}
.eb .eb-meta>div{display:flex;flex-direction:column;gap:6px;min-width:0;}
.eb .eb-meta dt{font-family:var(--eb-mono);font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-meta dd{margin:0;font-family:var(--eb-sans);font-size:14px;line-height:1.45;color:var(--eb-ink);}
.eb .eb-fig .eb-frame.eb-frame-logo{padding:34px 30px;display:flex;align-items:center;justify-content:center;}
.eb .eb-frame-logo img{display:block;width:100%;max-width:340px;height:auto;}

/* STAGE 02 · fuentes → nodo → tarjeta */
.eb .eb-fuentes-grid{display:grid;grid-template-columns:minmax(272px,1fr) 132px minmax(252px,.92fr);gap:0;align-items:start;min-width:656px;}
.eb .eb-fuentes-col{position:relative;display:flex;flex-direction:column;gap:0;min-width:0;}
.eb .eb-fuentes-line{position:absolute;top:46px;bottom:13px;right:0;width:1px;background:linear-gradient(180deg,#053061,#2166ac,#4393c3,#92c5de);}
.eb .eb-col-label{font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-dim);padding-bottom:10px;}
.eb .eb-fuente-row{display:grid;grid-template-columns:20px minmax(0,1fr) 28px;gap:12px;align-items:center;border-top:1px solid var(--eb-line-soft);padding:11px 0;}
.eb .eb-fuentes-end{border-top:1px solid var(--eb-line-soft);}
.eb .eb-fnum{font-family:var(--eb-mono);font-size:10px;color:var(--eb-dim);text-align:right;}
.eb .eb-fbody{display:flex;flex-direction:column;gap:2px;min-width:0;}
.eb .eb-fnombre{font-family:var(--eb-mono);font-size:12.5px;color:var(--eb-ink);}
.eb .eb-fdet{font-family:var(--eb-sans);font-size:11.5px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-fbar{height:1px;width:100%;display:block;}
.eb .eb-fuentes-mid{position:relative;align-self:stretch;display:flex;align-items:center;justify-content:center;min-height:200px;}
.eb .eb-fuentes-conn{position:absolute;top:50%;left:0;right:-22px;height:1px;background:linear-gradient(90deg,#4393c3 0%,#4393c3 18%,#f7f7f7 48%,#d6604d 76%,#d6604d 100%);}
.eb .eb-fuentes-node{position:relative;display:flex;align-items:center;justify-content:center;background:#f7f7f7;padding:7px 6px;}
.eb .eb-fuentes-node img{display:block;width:112px;height:auto;}
.eb .eb-fuentes-out{display:flex;flex-direction:column;gap:10px;min-width:0;padding-left:22px;}
.eb .eb-tarjeta{display:block;width:100%;max-width:276px;height:auto;}

/* STAGE 03 · capas */
.eb .eb-capa-row{display:grid;grid-template-columns:minmax(190px,.78fr) minmax(0,1.62fr);gap:34px;align-items:start;border-bottom:1px solid var(--eb-line-soft);padding:26px 0;}
.eb .eb-capa-row:last-child{border-bottom:none;}
.eb .eb-capa-l{display:flex;flex-direction:column;gap:10px;min-width:0;}
.eb .eb-capa-head{display:flex;align-items:baseline;gap:9px;}
.eb .eb-capa-name{font-family:var(--eb-mono-med);font-size:14px;font-weight:500;color:var(--eb-ink);letter-spacing:-.01em;}
.eb .eb-capa-stack{font-family:var(--eb-sans);font-size:12px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-capa-modo{align-self:flex-start;font-family:var(--eb-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);border:1px solid rgba(26,26,24,.34);border-radius:2px;padding:5px 9px;}
.eb .eb-capa-r{display:flex;flex-direction:column;gap:0;min-width:0;}
.eb .eb-capa-reg{display:grid;grid-template-columns:74px minmax(0,1fr);gap:16px;align-items:baseline;padding:7px 0;}
.eb .eb-reg-k{font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-reg-v{font-family:var(--eb-sans);font-size:14.5px;line-height:1.52;color:var(--eb-ink);text-wrap:pretty;}

/* STAGE 04 · personas */
.eb .eb-persona-tabs{display:flex;flex-wrap:wrap;gap:8px;border-bottom:1px solid var(--eb-line);padding-bottom:18px;margin-bottom:26px;}
.eb .eb-persona-tab{display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px;min-height:44px;padding:7px 13px;border-radius:2px;border:1px solid rgba(26,26,24,.28);cursor:pointer;text-align:left;font-family:var(--eb-mono);background:transparent;color:var(--eb-ink);transition:border-color .2s;}
.eb .eb-persona-tab:hover{border-color:var(--eb-ink);}
.eb .eb-persona-tab.is-active{background:var(--eb-ink);border-color:var(--eb-ink);color:#fafaf7;}
.eb .eb-persona-tabn{font-size:9.5px;letter-spacing:.12em;opacity:.72;}
.eb .eb-persona-tabnombre{font-size:12.5px;font-weight:500;letter-spacing:-.01em;}
.eb .eb-persona-body{display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;}
.eb .eb-persona-l{flex:0 1 232px;min-width:186px;display:flex;flex-direction:column;gap:10px;}
.eb .eb-persona-retrato{width:100%;aspect-ratio:1/1;border:1px solid rgba(26,26,24,.2);background-color:#eeeeea;background-size:cover;background-position:center 18%;}
.eb .eb-persona-meta{margin:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-persona-meta>div{display:grid;grid-template-columns:66px minmax(0,1fr);gap:10px;align-items:baseline;border-bottom:1px solid var(--eb-line-soft);padding:7px 0;}
.eb .eb-persona-meta dt{font-family:var(--eb-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-persona-meta dd{margin:0;font-family:var(--eb-sans);font-size:12px;line-height:1.42;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-persona-r{flex:1 1 360px;min-width:0;display:flex;flex-direction:column;gap:22px;}
.eb .eb-persona-title{display:flex;flex-direction:column;gap:7px;}
.eb .eb-persona-title h3{margin:0;font-family:var(--eb-mono);font-size:clamp(20px,2vw,27px);font-weight:500;line-height:1.2;letter-spacing:-.02em;color:#141412;}
.eb .eb-persona-quote{margin:0;padding-left:16px;border-left:2px solid var(--eb-warm-2);}
.eb .eb-persona-quote p{margin:0;font-family:var(--eb-sans);font-size:15.5px;font-style:italic;line-height:1.58;color:var(--eb-ink);max-width:52ch;text-wrap:pretty;}
.eb .eb-persona-dolores{display:flex;flex-direction:column;gap:0;}
.eb .eb-dolor-head{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:18px;border-bottom:1px solid var(--eb-ink);padding-bottom:8px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-dolor-row{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:18px;align-items:baseline;border-bottom:1px solid var(--eb-line-soft);padding:11px 0;}
.eb .eb-dolor-txt{font-family:var(--eb-sans);font-size:13.5px;line-height:1.5;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-dolor-sev{display:flex;flex-direction:column;gap:2px;}
.eb .eb-dolor-sev-n{font-family:var(--eb-mono-med);font-size:11px;font-weight:600;letter-spacing:.02em;color:var(--eb-ink);}
.eb .eb-dolor-efecto{font-family:var(--eb-sans);font-size:11.5px;line-height:1.35;color:var(--eb-dim);}
.eb .eb-persona-implic{display:flex;flex-direction:column;gap:11px;}
.eb .eb-implic-row{display:grid;grid-template-columns:14px minmax(0,1fr);gap:12px;align-items:baseline;}
.eb .eb-implic-row>span:last-child{font-family:var(--eb-sans);font-size:13.5px;line-height:1.52;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-implic-dot{height:5px;width:5px;border-radius:50%;background:var(--eb-cold-2);display:inline-block;transform:translateY(-3px);}

/* STAGE 05 · eslabones + logo beats */
.eb .eb-eslab-head{display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);gap:24px;border-bottom:1px solid var(--eb-ink);padding-bottom:10px;}
.eb .eb-eslab-head>span{display:flex;flex-direction:column;gap:3px;}
.eb .eb-eslab-head .eb-eslab-mid{text-align:center;}
.eb .eb-eslab-sub{font-family:var(--eb-sans);font-size:11.5px;line-height:1.35;color:var(--eb-dim);}
.eb .eb-eslab-row{display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);gap:24px;align-items:center;border-bottom:1px solid var(--eb-line-soft);padding:20px 0;}
.eb .eb-eslab-cold,.eb .eb-eslab-warm{display:flex;flex-direction:column;gap:6px;min-width:0;padding-left:14px;}
.eb .eb-eslab-cold{border-left:2px solid var(--eb-cold-2);}
.eb .eb-eslab-warm{border-left:2px solid var(--eb-warm-3);}
.eb .eb-eslab-key{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:var(--eb-ink);}
.eb .eb-eslab-gloss{font-family:var(--eb-sans);font-size:13px;line-height:1.48;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-eslab-mid-col{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0;}
.eb .eb-eslab-line{height:1px;width:100%;background:linear-gradient(90deg,var(--eb-cold-2),#f7f7f7 50%,var(--eb-warm-3));}
.eb .eb-eslab-rol{font-family:var(--eb-sans);font-size:10.5px;line-height:1.3;color:var(--eb-dim);text-align:center;}

/* STAGE 05 · logo beats */
.eb .eb-logo-beat{display:flex;flex-direction:column;gap:12px;padding-bottom:30px;}
.eb .eb-logo-beat.divider{border-top:1px solid var(--eb-line-soft);padding:30px 0;}
.eb .eb-logo-box{background:#fff;border:1px solid rgba(26,26,24,.18);padding:12px;box-sizing:border-box;}
.eb .eb-logo-box img{display:block;width:100%;height:auto;}
.eb .eb-logo-desc{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.55;color:var(--eb-body);max-width:68ch;text-wrap:pretty;}
.eb .eb-logo-desc em{font-style:italic;color:var(--eb-ink);}
.eb .eb-logo-final{display:flex;flex-wrap:wrap;gap:30px;align-items:center;border-top:1px solid var(--eb-line-soft);padding-top:30px;}
.eb .eb-logo-final-box{flex:0 1 300px;min-width:220px;background:#fff;border:1px solid rgba(26,26,24,.18);padding:28px 18px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;}
.eb .eb-logo-final-box img{display:block;width:100%;max-width:250px;height:auto;}
.eb .eb-logo-final-txt{flex:1 1 320px;min-width:0;display:flex;flex-direction:column;gap:12px;}
.eb .eb-logo-final-txt p{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.55;color:var(--eb-body);max-width:52ch;text-wrap:pretty;}

/* STAGE 06 · decisiones + dimensiones */
.eb .eb-decisiones{margin:48px 0 0;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--eb-ink);}
.eb .eb-decision{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;border-bottom:1px solid var(--eb-line);padding:30px 0;}
.eb .eb-dec-l{flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:11px;}
.eb .eb-dec-head{display:flex;align-items:baseline;gap:10px;}
.eb .eb-dec-head h3{margin:0;font-family:var(--eb-mono-med);font-size:clamp(16px,1.5vw,19px);font-weight:500;line-height:1.28;letter-spacing:-.015em;color:#141412;text-wrap:pretty;}
.eb .eb-dec-tag{align-self:flex-start;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);border:1px solid rgba(26,26,24,.28);border-radius:2px;padding:4px 8px;}
.eb .eb-dec-r{flex:2 1 420px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-dec-row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;padding:0 0 10px;}
.eb .eb-dec-row.hilite{padding:10px 0;border-top:1px solid var(--eb-line-soft);}
.eb .eb-dec-row.hilite:last-child{padding:10px 0 0;}
.eb .eb-dec-k{font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-dec-k.dim{color:var(--eb-dim);}
.eb .eb-dec-k.warn{color:#8a1a20;}
.eb .eb-dec-v{font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-dec-v.soft{color:var(--eb-body);}
.eb .eb-dim-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:22px;border-bottom:1px solid var(--eb-ink);padding-bottom:10px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-dim-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:22px;align-items:center;border-bottom:1px solid var(--eb-line-soft);padding:16px 0;}
.eb .eb-dim-name{display:flex;flex-direction:column;gap:3px;min-width:0;}
.eb .eb-dim-name .mono{font-size:13.5px;letter-spacing:0;}
.eb .eb-dim-que{font-family:var(--eb-sans);font-size:11.5px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-dim-bar{display:flex;align-items:center;gap:10px;min-width:0;}
.eb .eb-dim-fill{height:8px;display:block;}
.eb .eb-dim-fill.grey{background:#c9c9c2;}
.eb .eb-dim-fill.dark{background:#3d3d38;}
.eb .eb-dim-total{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:22px;padding-top:14px;}
.eb .eb-dim-total-l{font-family:var(--eb-sans);font-size:12px;line-height:1.45;color:var(--eb-ink);}

/* STAGE 07 · escala + prioridades + video */
.eb .eb-scale{display:flex;flex-wrap:wrap;gap:0;border-top:1px solid var(--eb-ink);}
.eb .eb-scale-col{flex:1 1 300px;min-width:0;display:flex;flex-direction:column;gap:9px;border-bottom:1px solid var(--eb-line-soft);padding:20px 26px 22px 0;}
.eb .eb-scale-col.warm{border-left:2px solid var(--eb-warm-3);padding:20px 0 22px 26px;}
.eb .eb-scale-title{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-scale-desc{font-family:var(--eb-sans);font-size:13.5px;line-height:1.55;color:var(--eb-body);max-width:46ch;text-wrap:pretty;}
.eb .eb-p-grid{display:flex;flex-wrap:wrap;gap:22px;padding-top:26px;}
.eb .eb-p-col{flex:1 1 200px;min-width:0;display:flex;flex-direction:column;gap:7px;padding-top:12px;}
.eb .eb-p-col span:first-child{font-family:var(--eb-mono);font-size:13px;letter-spacing:.06em;color:var(--eb-ink);}
.eb .eb-p-col span:last-child{font-family:var(--eb-sans);font-size:13.5px;line-height:1.5;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-videoframe{border-style:solid;border-color:var(--eb-ink);border-width:1px 4px 4px 1px;overflow:hidden;background:#0f0f0e;display:block;line-height:0;}
.eb .eb-videoframe video{display:block;width:100%;height:auto;}

/* STAGE 08.1 · paletas */
.eb .eb-pals{display:flex;flex-wrap:wrap;gap:34px;align-items:stretch;}
.eb .eb-pal-col{flex:1 1 300px;min-width:0;display:flex;flex-direction:column;gap:14px;}
.eb .eb-pal-title{display:flex;flex-direction:column;gap:4px;}
.eb .eb-pal-sub{font-family:var(--eb-sans);font-size:12px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-pal-bar{height:38px;width:100%;}
.eb .eb-pal-bar-cat{display:flex;height:38px;width:100%;}
.eb .eb-pal-bar-cat>span{flex:1;}
.eb .eb-pal-list{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--eb-line-soft);}
.eb .eb-pal-row{display:grid;grid-template-columns:12px minmax(0,1fr);gap:12px;align-items:start;border-bottom:1px solid var(--eb-line-soft);padding:10px 0;}
.eb .eb-pal-swatch{height:12px;width:12px;margin-top:3px;display:block;}
.eb .eb-pal-txt{display:flex;flex-direction:column;gap:2px;min-width:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.4;color:var(--eb-ink);}
.eb .eb-pal-txt .dim{font-size:12px;line-height:1.45;}
.eb .eb-pal-rules{margin-top:26px;border-top:1px solid var(--eb-ink);padding-top:16px;display:flex;flex-wrap:wrap;gap:28px;}
.eb .eb-pal-rules>div{flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:6px;}
.eb .eb-pal-rules>div>span:last-child{font-family:var(--eb-sans);font-size:13.5px;line-height:1.5;color:var(--eb-ink);text-wrap:pretty;}

/* STAGE 08.1 · frames de traducción */
.eb .eb-frames-trad{display:flex;flex-wrap:wrap;gap:26px;align-items:flex-start;}
.eb .eb-frame-t{flex:1 1 240px;min-width:210px;max-width:300px;display:flex;flex-direction:column;gap:12px;}
.eb .eb-frame-t-head{display:flex;align-items:center;gap:8px;}
.eb .eb-frame-t-dot{height:10px;width:10px;border-radius:50%;display:inline-block;}
.eb .eb-frame-t-img{width:100%;aspect-ratio:390/845;border:1px solid rgba(26,26,24,.2);background-color:#fff;background-size:100% auto;background-repeat:no-repeat;background-position:top center;}
.eb .eb-frame-t-nota{margin:0;font-family:var(--eb-sans);font-size:12.5px;line-height:1.5;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-frame-t-nota em{font-style:italic;color:var(--eb-ink);}

/* STAGE 08.2 · tabla de contraste + criterios */
.eb .eb-contraste-head{display:grid;grid-template-columns:112px minmax(0,1.5fr) 72px minmax(0,1.1fr);gap:20px;border-bottom:1px solid var(--eb-ink);padding-bottom:10px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-contraste-row{display:grid;grid-template-columns:112px minmax(0,1.5fr) 72px minmax(0,1.1fr);gap:20px;align-items:center;border-bottom:1px solid var(--eb-line-soft);padding:12px 0;}
.eb .eb-contraste-hex{display:flex;align-items:center;gap:8px;min-width:0;}
.eb .eb-contraste-chip{height:16px;width:16px;flex:none;border:1px solid rgba(26,26,24,.24);}
.eb .eb-contraste-uso{font-family:var(--eb-sans);font-size:13.5px;line-height:1.45;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-contraste-verd{display:flex;align-items:center;gap:8px;min-width:0;font-family:var(--eb-sans);font-size:12.5px;line-height:1.4;text-wrap:pretty;}
.eb .eb-contraste-dot{height:8px;width:8px;flex:none;border-radius:50%;display:inline-block;}
.eb .eb-contraste-nota{display:block;font-family:var(--eb-sans);font-size:11.5px;line-height:1.5;color:var(--eb-dim);padding-top:12px;}
.eb .eb-criterios{margin:52px 0 0;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--eb-ink);}
.eb .eb-criterio{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;border-bottom:1px solid var(--eb-line);padding:26px 0;}
.eb .eb-crit-l{flex:1 1 230px;min-width:0;display:flex;flex-direction:column;gap:8px;}
.eb .eb-crit-name{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-crit-tag{align-self:flex-start;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-width:1px;border-style:solid;border-radius:2px;padding:4px 8px;}
.eb .eb-crit-r{flex:2 1 400px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-crit-row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;padding:0 0 10px;}
.eb .eb-crit-row.hilite{padding:10px 0 0;border-top:1px solid var(--eb-line-soft);}
.eb .eb-crit-k{font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-crit-k.dim{color:var(--eb-dim);}
.eb .eb-crit-v{font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-crit-v.soft{color:var(--eb-body);}

/* STAGE 09 · producto */
.eb .eb-prod-intro{display:flex;flex-wrap:wrap;gap:64px;align-items:flex-start;padding:72px 0 24px 24px;}
.eb .eb-prod-video{flex:0 0 300px;margin:0;}
.eb .eb-prod-intro-txt{flex:1 1 340px;min-width:0;display:flex;flex-direction:column;gap:24px;}
.eb .eb-prod-intro-txt>div:first-child{display:flex;flex-direction:column;gap:20px;}
.eb .eb-recorrido{border-top:1px solid var(--eb-line);padding-top:14px;display:flex;flex-direction:column;gap:10px;}
.eb .eb-recorrido-line{font-family:var(--eb-mono);font-size:14px;line-height:1.6;letter-spacing:-.01em;color:#141412;max-width:52ch;text-wrap:pretty;}
.eb .eb-producto{margin:52px 0 0;display:flex;flex-direction:column;gap:0;}
.eb .eb-prod-row{display:flex;flex-wrap:wrap;gap:44px;align-items:flex-start;border-top:1px solid var(--eb-ink);padding:26px 0 52px;}
.eb .eb-prod-l{flex:1 1 290px;min-width:0;display:flex;flex-direction:column;gap:16px;}
.eb .eb-prod-head{display:flex;align-items:baseline;gap:12px;}
.eb .eb-prod-title{font-family:var(--eb-mono-med);font-size:17px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-prod-tono{height:4px;width:64px;}
.eb .eb-prod-vienen{display:flex;flex-direction:column;gap:6px;}
.eb .eb-prod-chips{display:flex;flex-wrap:wrap;gap:6px;}
.eb .eb-prod-chip{font-family:var(--eb-mono);font-size:10.5px;letter-spacing:.04em;color:var(--eb-ink);border:1px solid rgba(26,26,24,.3);border-radius:2px;padding:5px 8px;}
.eb .eb-prod-notas{display:flex;flex-direction:column;gap:13px;border-top:1px solid var(--eb-line-soft);padding-top:15px;}
.eb .eb-prod-notas p{margin:0;font-family:var(--eb-sans);font-size:14px;line-height:1.58;color:var(--eb-body);max-width:52ch;text-wrap:pretty;}
.eb .eb-prod-r{flex:2 1 520px;min-width:0;}
.eb .eb-screens{display:flex;gap:22px;align-items:flex-start;overflow-x:auto;}
.eb .eb-screen{margin:0;flex:0 0 232px;display:flex;flex-direction:column;gap:10px;}
.eb .eb-screen-img{width:100%;border:1px solid rgba(26,26,24,.2);background-color:#fff;background-size:100% auto;background-repeat:no-repeat;background-position:top center;}
.eb .eb-screen figcaption{font-family:var(--eb-sans);font-size:12px;line-height:1.45;color:var(--eb-dim);text-wrap:pretty;}
.eb .eb-prod-footnote{margin:8px 0 0;font-family:var(--eb-mono);font-size:11px;letter-spacing:.06em;color:var(--eb-dim);text-wrap:pretty;}

/* STAGE 10 · validación */
.eb .eb-val-row{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;border-bottom:1px solid var(--eb-line);padding:26px 0;}
.eb .eb-val-row:first-child{border-top:1px solid var(--eb-ink);}
.eb .eb-val-l{flex:1 1 230px;min-width:0;display:flex;flex-direction:column;gap:9px;}
.eb .eb-val-title{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-val-tag{align-self:flex-start;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-width:1px;border-style:solid;border-radius:2px;padding:4px 8px;}
.eb .eb-val-scale{display:flex;flex-direction:column;gap:6px;padding-top:6px;}
.eb .eb-val-bar{height:7px;display:block;}
.eb .eb-val-r{flex:2 1 400px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-val-txt{margin:0 0 12px;font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-val-porque{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;padding:12px 0 0;border-top:1px solid var(--eb-line-soft);font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;}

/* STAGE 11 · timeline y cierre */
.eb .eb-timeline-bar{height:5px;width:100%;border-bottom:1px solid rgba(26,26,24,.22);background:linear-gradient(90deg,#2166ac 0%,#4393c3 26%,#d1e5f0 46%,#fddbc7 56%,#d6604d 78%,#b2181f 100%);}
.eb .eb-timeline{display:flex;gap:0;align-items:stretch;padding-top:0;}
.eb .eb-hito{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:9px;padding:0 18px 0 0;}
.eb .eb-hito-dot{height:14px;width:14px;flex:none;border-radius:50%;margin-top:-4px;}
.eb .eb-hito-fase{font-family:var(--eb-mono-med);font-size:14px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-hito-det{font-family:var(--eb-sans);font-size:12.5px;line-height:1.5;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-cierre{margin:96px 0 0;font-family:var(--eb-mono-med);font-weight:500;font-size:clamp(24px,3.4vw,44px);line-height:1.24;letter-spacing:-.02em;color:#141412;max-width:24ch;text-wrap:pretty;}

/* responsivo · plegado a una columna */
@media(max-width:900px){
  .eb .eb-two,.eb .eb-cover,.eb .eb-prod-intro,.eb .eb-prod-row{gap:32px;}
  .eb .eb-two-r{border-left:none;padding-left:0;border-top:1px solid var(--eb-line);padding-top:22px;}
  .eb .eb-fuentes-grid{grid-template-columns:1fr;min-width:0;}
  .eb .eb-fuentes-line,.eb .eb-fuentes-conn{display:none;}
  .eb .eb-fuentes-mid{min-height:auto;padding:12px 0;}
  .eb .eb-fuentes-out{padding-left:0;}
  .eb .eb-capa-row{grid-template-columns:1fr;gap:16px;}
  .eb .eb-eslab-head,.eb .eb-eslab-row{grid-template-columns:1fr;gap:14px;}
  .eb .eb-eslab-mid-col{align-items:flex-start;}
  .eb .eb-decision,.eb .eb-criterio,.eb .eb-val-row{gap:20px;}
  .eb .eb-timeline{flex-direction:column;gap:24px;}
  .eb .eb-hito{padding:0;}
  .eb .eb-dim-head,.eb .eb-dim-row,.eb .eb-dim-total{grid-template-columns:1fr;gap:8px;}
  .eb .eb-contraste-head,.eb .eb-contraste-row{grid-template-columns:1fr;gap:6px;}
  .eb .eb-contraste-head .right,.eb .eb-contraste-row .right{text-align:left;}
}
`;
