import { useEffect, useRef, useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import carolinaFull from '@/imports/edubig/persona-carolina-full.png';
import martinFull from '@/imports/edubig/persona-martin-full.png';
import tomasFull from '@/imports/edubig/persona-tomas-full.png';
import bocetos from '@/imports/edubig/boceto-traduccion.jpg';
import logoConstru from '@/imports/edubig/logo-construccion.jpg';
import ficha1 from '@/imports/edubig/ficha-1.png';
import ficha2 from '@/imports/edubig/ficha-2.png';
import portada from '@/imports/edubig/portada.png';

/**
 * EdubigCaseStudy — case study dedicado de Edubig.
 *
 * Tiene su propio diseño (más rico que el modelo Stage), pero conserva los
 * elementos mínimos del sistema: NavBar (la pone App), BackButton, la MISMA
 * regla vertical (ProgressBar) que los demás detalles de proyecto, el header
 * `label · categoría · año` + título, y una grilla estable alineada a la
 * izquierda (offset `pl-[188px]`, igual que ProjectDetail). Todo el CSS propio
 * vive bajo `.eb` para no filtrarse al resto del sitio.
 */

const PERSONAS = [
  { img: carolinaFull, name: 'Carolina Muñoz', role: 'La mamá práctica' },
  { img: martinFull, name: 'Martín Soto', role: 'El estudiante que co-decide' },
  { img: tomasFull, name: 'Tomás y Francisca', role: 'La pareja investigadora' },
];

const BRECHA = [
  { n: 'A. Graham Bell', v: 31 },
  { n: 'Brasilia', v: 12 },
  { n: 'Alborada', v: 4 },
  { n: 'Los Andes', v: -9 },
  { n: 'San Daniel', v: -24, warn: true },
];

const WELLS: { name: string; rows: [string, number][] }[] = [
  { name: 'Convivencia', rows: [['colegio', 78], ['similares', 71], ['nacional', 74]] },
  { name: 'Autoestima', rows: [['colegio', 82], ['similares', 76], ['nacional', 78]] },
];

export default function EdubigCaseStudy({ onBack }: { onBack: () => void }) {
  const [pi, setPi] = useState(0);
  const [on, setOn] = useState(false);
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

  // Autoplay al entrar en viewport (silenciado, requisito de los navegadores).
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
  const next = () => setPi((i) => (i + 1) % PERSONAS.length);
  const prev = () => setPi((i) => (i - 1 + PERSONAS.length) % PERSONAS.length);

  return (
    <div className="eb bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      {/* Regla vertical — misma navegación que el resto de los proyectos */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical />
      </div>

      <div ref={contentRef} className="eb-content">
        <div style={{ marginBottom: 32 }}>
          <BackButton onClick={onBack} />
        </div>

        {/* Header — mismo formato que los demás detalles de proyecto */}
        <header className="eb-flow eb-header">
          <p className="eyebrow">Proyecto 06 · Product Design · Data-viz · 2026</p>
          <h1>Edubig</h1>
          <p className="lead">Un sistema que se traduce en cuidado.</p>
          <p className="prose">
            Plataforma abierta de datos escolares para familias chilenas. Traduce cinco fuentes oficiales
            fragmentadas —Mineduc, SIMCE, IDPS, Supereduc, DEMRE— en una decisión clara, sin caer en el
            ranking crudo.
          </p>

          <div className="eb-cover"><img src={portada} alt="Edubig — portada del proyecto" /></div>
          <div className="cover-meta" style={{ marginTop: 20 }}>
              <div><span className="label">Rol</span><span className="val">Producto, diseño, sistema, motor y datos</span></div>
              <div><span className="label">Equipo</span><span className="val">Dirijo la colaboración: Israel (datos) · Claude (par técnico)</span></div>
              <div><span className="label">Stack</span><span className="val">Figma · Python · Next.js · Vercel · Claude</span></div>
              <div><span className="label">Estado</span><span className="val">MVP Pudahuel completo · migración a Chile nacional (7.168 colegios) en curso</span></div>
            </div>
          <div className="callout"><p><strong>Design Thinking iterativo:</strong> este case study documenta un ciclo vivo, no un proyecto cerrado. Se re-está construyendo el dataset base para pasar de una comuna a todo el país, y luego testear con familias reales.</p></div>
        </header>

        {/* SÍNTESIS */}
        <section className="eb-flow sec">
          <p className="eyebrow">Síntesis</p>
          <h2>La respuesta primero</h2>
          <p className="lead prose">Pirámide de Minto, para quien escanea en 60 segundos.</p>
          <div className="tldr">
            <div><span className="n">01</span><div><h3>El problema</h3><p>Elegir colegio en Chile obliga a cruzar cinco portales oficiales que no se conectan y a interpretar rankings que correlacionan más con nivel socioeconómico que con calidad pedagógica.</p></div></div>
            <div><span className="n">02</span><div><h3>La solución</h3><p>Una plataforma nacional con tres promesas al mismo nivel: comparar colegios lado a lado, recomendar vía test de calce, y explorar el universo por métrica con contexto GSE. Motor determinístico y trazable.</p></div></div>
            <div><span className="n">03</span><div><h3>La postura</h3><p>Anti-ranking. Ningún número aparece sin su contexto GSE: cada colegio se lee contra el promedio de sus similares, no contra el sistema entero. Es una decisión ética defendida con evidencia.</p></div></div>
          </div>
        </section>

        {/* CONTEXTO */}
        <section className="eb-flow sec">
          <p className="eyebrow">Contexto</p>
          <h2>Cinco portales, cero traducción</h2>
          <p className="prose">Para entender un colegio hoy, una familia debe cruzar —como mínimo— cinco fuentes oficiales que no dialogan entre sí. La familia hace de integrador manual.</p>
          <div className="sources">
            <div className="source"><div className="nm">Mineduc</div><div className="sub">Datos administrativos · directorio nacional</div></div>
            <div className="source"><div className="nm">SIMCE</div><div className="sub">Rendimiento académico por área</div></div>
            <div className="source"><div className="nm">IDPS</div><div className="sub">Desarrollo integral · clima, autoestima</div></div>
            <div className="source"><div className="nm">Supereduc</div><div className="sub">Denuncias y sanciones</div></div>
            <div className="source"><div className="nm">DEMRE</div><div className="sub">Trayectoria universitaria</div></div>
          </div>
          <div className="callout warm"><p>Ninguna fuente se conecta con las otras. Los rankings públicos lo simplifican todo a un número que correlaciona con NSE, no con calidad pedagógica — el propio DEMRE prohíbe usar la PAES para rankear colegios.</p></div>
        </section>

        {/* ROL & MÉTODO */}
        <section className="eb-flow sec">
          <p className="eyebrow">Rol y método</p>
          <h2>Diseñador dirigiendo un equipo colaborativo</h2>
          <p className="prose">Producto, diseño y sistema son míos. Datos y frontend se ejecutan con colaboradores dirigidos. La complejidad técnica se delega; el criterio, nunca.</p>
          <div className="grid2">
            <div className="mini">
              <span className="label">Qué dirijo y ejecuto</span>
              <ul className="ticks">
                <li>Concepto rector, principios y trade-offs de producto</li>
                <li>Investigación con evidencia secundaria (BID, Agencia de Calidad, benchmark internacional)</li>
                <li>Sistema de diseño en Figma con tokens propios</li>
                <li>Motor de scoring determinístico (dos capas)</li>
                <li>Estructura del pipeline de datos y esquema del dataset</li>
              </ul>
            </div>
            <div className="mini">
              <span className="label">Con quién colaboro</span>
              <h3 style={{ marginTop: 12 }}>Israel Rubilar · analista de datos</h3>
              <p>Coordinador de Análisis Institucional (U. Alberto Hurtado). Cierra el schema del dataset nacional y aporta autoridad reputacional al lanzamiento.</p>
              <h3 style={{ marginTop: 14 }}>Claude · par técnico dirigido</h3>
              <p>Acelera la implementación: scripts de Figma, pipeline de datos, frontend en Next.js. Cada decisión de producto pasa por mi juicio y queda en la bitácora.</p>
            </div>
          </div>
          <div className="callout"><p>El red flag no es delegar la ejecución — es delegar el criterio. Ese es el que retengo.</p></div>
        </section>

        {/* INVESTIGACIÓN · PERSONAS (visor de tus láminas originales) */}
        <section className="eb-flow sec">
          <p className="eyebrow">Investigación</p>
          <h2>Personas basadas en evidencia real</h2>
          <p className="prose">Las personas de Edubig no son inventadas. NN/g advierte que los personas inventados son «prueba poco convincente»: cada dolor, dispositivo y prioridad es trazable a una fuente pública (BID, Agencia de Calidad, estudio SIMCE, benchmark internacional).</p>
          <div className="evid">
            <div><div className="es">BID</div><div className="en">Preferencias parentales · admisión centralizada</div><div className="ed">NSE bajo prioriza proximidad y atributos no académicos; NSE alto, calidad y proyecto.</div></div>
            <div><div className="es">Agencia de Calidad</div><div className="en">Voces de los Apoderados 2018 · n = 590.601</div><div className="ed">55,8% espera carrera universitaria; 77% cree a sus hijos protegidos de violencia.</div></div>
            <div><div className="es">Estudio SIMCE</div><div className="en">Comprensión de reportes · métodos mixtos</div><div className="ed">La mayoría interpreta mal la información básica, aunque el reporte les parece claro.</div></div>
            <div><div className="es">Benchmark internacional</div><div className="en">GreatSchools · Niche · Ofsted · ERO</div><div className="ed">Las plataformas exitosas combinan geolocalización + contexto + multidimensionalidad.</div></div>
          </div>

          <p className="pv-lead">Tres personas, un mismo dato leído a tres profundidades. Recórrelas →</p>
          <div className="pv">
            <button
              type="button"
              className="pv-frame"
              onClick={next}
              aria-label={`${persona.name} — ${persona.role}. Clic para ver las otras ${PERSONAS.length - 1} personas`}
            >
              <img src={persona.img} alt={`Persona: ${persona.name} — ${persona.role}`} />
              <span className="pv-hint" aria-hidden="true">+{PERSONAS.length - 1} · ver las otras personas →</span>
            </button>
            <div className="pv-controls">
              <div className="pv-dots">
                {PERSONAS.map((p, i) => (
                  <button key={p.name} className={'pv-dot' + (i === pi ? ' active' : '')} aria-label={`Ver ${p.name}`} aria-current={i === pi} onClick={() => setPi(i)} />
                ))}
                <span className="pv-name">{persona.name} · {persona.role} · {pi + 1} / {PERSONAS.length}</span>
              </div>
              <div className="pv-nav">
                <button className="pv-btn" onClick={prev} aria-label="Persona anterior">←</button>
                <button className="pv-btn" onClick={next} aria-label="Persona siguiente">→</button>
              </div>
            </div>
          </div>
        </section>

        {/* INSIGHT */}
        <section className="eb-flow sec">
          <p className="eyebrow">Insight</p>
          <h2>Diseñar para «el usuario promedio» es diseñar para nadie</h2>
          <p className="prose">Los tres personas comparten cinco dolores transversales, pero cada uno los sufre distinto. El sistema debe operar en tres registros simultáneos.</p>
          <div className="pains">
            <div className="pain"><span className="pn">01</span><div><span className="ph">Gap de comprensión</span><div className="pd">Ver un dato no equivale a entenderlo. Aun con reportes «claros», los padres interpretan mal la información básica.</div></div></div>
            <div className="pain"><span className="pn">02</span><div><span className="ph">Fragmentación de fuentes</span><div className="pd">Cinco portales que no se conectan. La familia hace de integrador manual.</div></div></div>
            <div className="pain"><span className="pn">03</span><div><span className="ph">Sesgo de ranking</span><div className="pd">Los listados públicos simplifican calidad a un número que oculta el contexto socioeconómico.</div></div></div>
            <div className="pain"><span className="pn">04</span><div><span className="ph">Exclusión digital</span><div className="pd">Los portales estatales no funcionan bien en móvil ni en baja alfabetización: excluyen a quien más los necesita.</div></div></div>
            <div className="pain"><span className="pn">05</span><div><span className="ph">Ansiedad de decisión</span><div className="pd">Elegir colegio se percibe irreversible. Las familias quieren sentirse seguras, no solo informadas.</div></div></div>
          </div>
        </section>

        {/* CONCEPTO */}
        <section className="eb-flow sec">
          <p className="eyebrow">Concepto</p>
          <h2>Un sistema que se traduce en cuidado</h2>
          <p className="prose">La traducción es el verbo rector, anclado en el concepto de isomorfismo de Hofstadter: un puente fiel a los dos lados sin aplanar ninguno.</p>
          <div className="chain3">
            <div className="cc input"><div className="cch">Dato · input</div><p className="w">Imparcial</p><div className="a">↓</div><p className="w">Frío</p><div className="a">↓</div><p className="w">Honesto</p></div>
            <div className="cc bridge"><div className="cch">Puente · Edubig</div><p className="w">Accesible</p><div className="a">↓</div><p className="w">Comprensible</p><div className="a">↓</div><p className="w">Informado</p></div>
            <div className="cc output"><div className="cch">Familia · output</div><p className="w">Cuidado</p><div className="a">↓</div><p className="w">Preocupación</p><div className="a">↓</div><p className="w">Seguridad</p></div>
          </div>
          <div className="resolve">Un sistema que se traduce en cuidado</div>
          <div className="palette">
            {['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582', '#d6604d', '#b2181f', '#67001f'].map((c) => (
              <div key={c} className="p" style={{ background: c }} />
            ))}
          </div>
          <p className="figcap">Escala RdBu (ColorBrewer) como identidad del sistema: frío para el dato imparcial, cálido para el cuidado familiar. El principio anti-ranking se deriva de aquí — una traducción fiel es fiel a los dos lados.</p>
        </section>

        {/* DEL CONCEPTO AL LOGOTIPO */}
        <section className="eb-flow sec">
          <p className="eyebrow">Del concepto al logotipo</p>
          <h2>La traducción, hecha forma</h2>
          <p className="prose">Si el sistema traduce, la marca debía traducir también. La exploración fue del dato frío al dato cálido, y pasó por el gesto de un <em>toggle switch</em>: el interruptor que enciende la traducción.</p>
          <div className="logo-beats">
            <figure className="fig">
              <div className="frame"><img src={bocetos} alt="Bocetos de exploración del logotipo de Edubig" /></div>
              <figcaption className="figcap">Bocetos de exploración — del dato frío al dato cálido, del switch ON/OFF a las dos cápsulas.</figcaption>
            </figure>
            <div className="toggle-demo">
              <span className="label">El gesto, en vivo</span>
              <button className={'tg' + (on ? ' is-on' : '')} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Alternar dato frío / cálido">
                <span className="tg-track"><span className="tg-knob">{on ? 'eB' : '011'}</span></span>
              </button>
              <div className={'tg-state' + (on ? ' on' : '')}>{on ? 'Dato cálido · traducido' : 'Dato frío · sin traducir'}</div>
              <p className="figcap" style={{ marginTop: 14 }}>Acciónalo: el mismo gesto de frío a cálido que da forma al isologo — y un guiño al chip de filtro del producto.</p>
            </div>
          </div>
          <figure className="fig" style={{ marginTop: 24 }}>
            <div className="frame"><img src={logoConstru} alt="Construcción del logotipo de Edubig" /></div>
            <figcaption className="figcap">De la metáfora a la forma: la retícula del toggle define las dos cápsulas del isologo — 011 en tipo pixel sobre azul frío (el dato), eB en serif sobre coral cálido (la traducción).</figcaption>
          </figure>
        </section>

        {/* FRAMING */}
        <section className="eb-flow sec">
          <p className="eyebrow">Framing</p>
          <h2>Tres promesas al mismo nivel</h2>
          <p className="prose">Comparar, recomendar y explorar. Ninguna subordinada a las otras — la línea superior las mantiene en el mismo plano.</p>
          <div className="promises"><div className="promise-grid">
            <div className="promise"><div className="dot" /><h3>Comparar</h3><p>Dos o tres colegios lado a lado con semáforo semántico y visualización honesta. La familia entra con nombres y sale con distinciones claras.</p><span className="tag">Módulo comparación · viz cualitativa</span></div>
            <div className="promise"><div className="dot" /><h3>Recomendar</h3><p>Test de calce Q1–Q5 que devuelve una shortlist por afinidad. Reglas transparentes en dos capas: filtros duros + scoring ponderado.</p><span className="tag">Test de Calce · motor determinístico</span></div>
            <div className="promise"><div className="dot" /><h3>Explorar</h3><p>Universo ordenable por la métrica que el usuario elige, siempre con contexto GSE. Nunca «top 10 absolutos» — sí «colegios sobre su grupo similar».</p><span className="tag">Exploración libre · contexto GSE</span></div>
          </div></div>
        </section>

        {/* DECISIONES */}
        <section className="eb-flow sec">
          <p className="eyebrow">Decisiones de diseño</p>
          <h2>Tres decisiones de diseño</h2>
          <p className="prose">Cada una es un rechazo explícito, una elección y un trade-off asumido.</p>
          {[
            { k: '01', t: 'Anti-ranking como postura', no: 'El ranking absoluto. Simplifica calidad a un número que correlaciona con NSE; genera ansiedad y distorsiona la decisión.', yes: 'Fit contextual multidimensional: cada colegio se compara solo contra su grupo GSE, en cinco dimensiones separadas (SIMCE + IDPS).', tr: 'Más fricción cognitiva. Se compensa con disclosure progresivo: primero el insight legible, luego el gráfico, después la metodología.' },
            { k: '02', t: 'Comparar contra pares, no contra el sistema', no: 'Escalas absolutas nacionales, que castigan a los establecimientos vulnerables por su contexto y no por su desempeño real.', yes: 'Gráfico de brecha vs. GSE similar, con escala universal de ±56 puntos (rango real del universo). La lectura vuelve honesta.', tr: 'Grupos de referencia pequeños se vuelven volátiles: se resuelve con una advertencia visible, no ocultando el dato.' },
            { k: '03', t: 'Motor determinístico, no modelo opaco', no: 'Un modelo de recomendación cerrado. En una decisión de alta carga emocional, la trazabilidad genera confianza; la magia, no.', yes: 'Dos capas de reglas transparentes: filtros duros no-negociables + suma ponderada de cinco dimensiones. Cada recomendación se audita paso a paso.', tr: 'Menos «wow», más responsabilidad: la familia entiende por qué aparece cada colegio.' },
          ].map((d) => (
            <div className="decision" key={d.k}>
              <div className="dhead"><span className="label">Decisión {d.k}</span><h3>{d.t}</h3></div>
              <div className="drow"><span className="rk no">Rechacé</span><span className="rv">{d.no}</span></div>
              <div className="drow"><span className="rk yes">Elegí</span><span className="rv">{d.yes}</span></div>
              <div className="drow"><span className="rk trade">Trade-off</span><span className="rv">{d.tr}</span></div>
            </div>
          ))}
        </section>

        {/* INGENIERÍA DE DATOS */}
        <section className="eb-flow sec">
          <p className="eyebrow">Ingeniería de datos · co-work con IA</p>
          <h2>De cuatro fuentes oficiales a un JSON maestro</h2>
          <p className="prose">El pipeline y el motor de scoring son infraestructura. Los construí dirigiendo a Claude como par técnico: yo defino el esquema y las reglas, la IA acelera la ejecución. Cada paso queda trazado.</p>
          <figure className="fig">
            <div className="eb-videoframe wide"><video ref={video1Ref} src="/edubig-proceso-datos.mp4" muted controls playsInline preload="metadata" /></div>
            <figcaption className="figcap">Video 01 · Ingeniería de datos — proceso de limpieza y unificación de fuentes, mostrando el co-work con IA.</figcaption>
          </figure>
          <div className="pipe">
            <div className="node"><div className="nt">4 fuentes</div><div className="nd">SIMCE · IDPS · denuncias · directorio</div></div>
            <div className="arw">→</div>
            <div className="node hi"><div className="nt">Limpieza + normalización</div><div className="nd">Python dirigido · reglas y esquema definidos por mí</div></div>
            <div className="arw">→</div>
            <div className="node"><div className="nt">JSON maestro</div><div className="nd">57 colegios · 88 columnas · MVP Pudahuel</div></div>
          </div>
          <div className="callout"><p>Expansión en curso: se invirtió el flujo del pipeline — ahora yo entrego la estructura (schema de 340 campos) e Israel rellena el dataset sobre esa forma. Meta: 7.168 colegios de todo Chile sin romper el esquema del sitio en cada iteración.</p></div>
        </section>

        {/* VISUALIZACIÓN DE DATOS */}
        <section className="eb-flow sec">
          <p className="eyebrow">Visualización de datos</p>
          <h2>El sistema de datos se vuelve visible</h2>
          <p className="prose">La visualización no decora las conclusiones: las sostiene. Cada gráfico es una decisión sobre qué pregunta responde — y qué geometría la responde.</p>

          {/* Brecha SIMCE — dato real de Pudahuel */}
          <div className="brecha">
            <div className="brecha-head"><span className="label">Brecha SIMCE · vs. colegios similares (mismo GSE)</span><span className="label">escala universal ±56 pts</span></div>
            <div className="brecha-rows">
              {BRECHA.map((r) => (
                <div className="brow" key={r.n}>
                  <div className="bname">{r.n}{r.warn && <span className="warnchip">grupo pequeño</span>}</div>
                  <div className="btrack">
                    <div className="baxis" />
                    <div className={'bbar ' + (r.v >= 0 ? 'pos' : 'neg')} style={r.v >= 0 ? { left: '50%', width: (Math.abs(r.v) / 56) * 50 + '%' } : { right: '50%', width: (Math.abs(r.v) / 56) * 50 + '%' }} />
                    <span className={'bval ' + (r.v >= 0 ? 'pos' : 'neg')} style={r.v >= 0 ? { left: `calc(50% + ${(Math.abs(r.v) / 56) * 50}% + 8px)` } : { right: `calc(50% + ${(Math.abs(r.v) / 56) * 50}% + 8px)` }}>{r.v > 0 ? '+' + r.v : r.v}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="brecha-scale"><span>−56</span><span>−28</span><span>0 · promedio similares</span><span>+28</span><span>+56</span></div>
            <p className="figcap"><span className="dotlg pos" /> sobre su grupo GSE · <span className="dotlg neg" /> bajo su grupo GSE. El signo del dato manda: verde/mostaza, nunca el coral de identidad.</p>
          </div>

          {/* Nota metodológica — por qué ±56 */}
          <div className="dv-block">
            <div className="dv-head"><span className="label">Nota metodológica</span><span className="label">por qué ±56</span></div>
            <h3>La escala no es cosmética</h3>
            <p>El eje ±56 no es una convención estética: es el rango real observado en el dataset de Pudahuel (57 colegios, 88 variables). Fijar una escala universal permite que dos colegios de comunas distintas se lean con el mismo criterio visual, sin que la brecha «parezca» mayor o menor por el zoom del eje.</p>
            <p className="figcap">Cuando el eje cambia entre gráficos, el ojo miente — la <em>lie factor</em> de Tufte. Fijar el eje al rango real del universo es la contramedida más simple.</p>
          </div>

          {/* Decisión de geometría — antes / después */}
          <div className="dv-block">
            <div className="dv-head"><span className="label">Decisión de geometría</span><span className="label">iteración descartada · elegida</span></div>
            <h3>Antes de la brecha: dos líneas paralelas</h3>
            <p>La primera versión mostraba el puntaje del colegio y el promedio de similares como dos líneas paralelas. Correcto en los datos, incorrecto en la pregunta: obligaba a la familia a hacer la resta mental y a inferir el signo.</p>
            <div className="dv-compare">
              <div className="dv-panel">
                <span className="dv-tag">Descartado</span>
                <h4>Dos líneas paralelas</h4>
                <div className="dv-parallel">
                  <div className="pl-line colegio"><span>colegio</span></div>
                  <div className="pl-line similares"><span>similares</span></div>
                  <div className="pl-gap" />
                </div>
                <p className="dv-why">El lector ve dos valores. La conclusión —«sobre o bajo su grupo»— queda por hacer.</p>
              </div>
              <div className="dv-panel chosen">
                <span className="dv-tag">Elegido</span>
                <h4>Barra de brecha</h4>
                <div className="dv-minigap">
                  <div className="mg-axis" />
                  <div className="mg-bar" />
                  <div className="mg-val">+31</div>
                  <div className="mg-zero">0 · promedio similares</div>
                </div>
                <p className="dv-why">La brecha ES el dato. El signo y la magnitud se leen antes de terminar la frase.</p>
              </div>
            </div>
          </div>

          {/* Bienestar IDPS — escala absoluta */}
          <div className="dv-block">
            <div className="dv-head"><span className="label">Bienestar · IDPS</span><span className="label">escala absoluta 0–100</span></div>
            <h3>Cuando la brecha no es la respuesta</h3>
            <p>Académico y Bienestar responden preguntas distintas, y por eso usan geometrías distintas. Bienestar compara tres alturas absolutas —colegio, similares, nacional— sobre un eje 0–100. Forzarlo a brecha ocultaría el nivel. La coherencia del sistema no es usar el mismo gráfico: es usar el correcto.</p>
            <div className="dv-wells">
              {WELLS.map((g) => (
                <div className="dv-wellgroup" key={g.name}>
                  <span className="dv-wname">{g.name}</span>
                  <div className="dv-wcol">
                    {g.rows.map(([k, v]) => (
                      <div className="dv-well" key={k}>
                        <div className="dv-wtrack"><div className={'dv-wfill ' + k} style={{ width: v + '%' }} /></div>
                        <span className="dv-wv">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="dv-welllegend"><span className="lg colegio">colegio</span><span className="lg similares">similares</span><span className="lg nacional">nacional</span></div>
            <p className="figcap">Tres valores explícitos, sin resta mental. La escala 0–100 es intrínseca al indicador; no se universaliza porque no hace falta. Datos ilustrativos del patrón.</p>
          </div>

          {/* Grupo GSE — contra quién se compara */}
          <div className="dv-block">
            <div className="dv-head"><span className="label">Contra quién se compara</span><span className="label">grupo de referencia · GSE</span></div>
            <h3>El «+31» es contra un grupo, no contra todos</h3>
            <p>Cada brecha tiene un peer group detrás. Volverlo visible es lo que sostiene el sistema anti-ranking: el mismo colegio puede estar sobre su grupo y aún lejos del máximo nacional — y eso no es contradicción, es la lectura correcta.</p>
            <div className="dv-gse">
              <div>
                <div className="dv-gsemap">
                  <div className="gse-band" />
                  <span className="gse-dot" style={{ left: '22%', top: '60%' }} />
                  <span className="gse-dot" style={{ left: '34%', top: '52%' }} />
                  <span className="gse-dot" style={{ left: '46%', top: '65%' }} />
                  <span className="gse-dot" style={{ left: '58%', top: '48%' }} />
                  <span className="gse-dot focus" style={{ left: '78%', top: '42%' }} />
                  <span className="gse-lab" style={{ left: '78%', top: '14%' }}>Graham Bell</span>
                  <span className="gse-lab sub" style={{ left: '40%', top: '86%' }}>18 colegios similares</span>
                </div>
                <p className="figcap">Grupo estable: 18 pares del mismo GSE. La brecha +31 se lee con confianza.</p>
              </div>
              <div>
                <div className="dv-gsemap small">
                  <div className="gse-warn">Grupo pequeño (n = 4): la brecha se muestra con menor peso visual y una advertencia explícita — el promedio de similares es menos estable.</div>
                </div>
                <p className="figcap">Caso San Daniel: cuando el peer group es chico, el signo puede oscilar. El sistema no lo oculta — lo señala.</p>
              </div>
            </div>
          </div>

          {/* Regla de carriles de color */}
          <div className="dv-block">
            <div className="dv-head"><span className="label">Reglas de color en dato</span><span className="label">el RdBu vive en identidad, no aquí</span></div>
            <h3>Un color, un carril</h3>
            <p>El azul-rojo de identidad (ver Concepto) no aparece en los gráficos. Los datos viven en dos carriles: verde/mostaza para dirección respecto al grupo, y una serie categórica cuando hay que distinguir sin jerarquía. Nunca se cruzan.</p>
            <div className="dv-lanes">
              <div className="dv-lane">
                <span className="label">Semántico · dirección</span>
                <div className="dv-sw"><div style={{ background: '#388e3c' }} /><div style={{ background: '#a08828' }} /></div>
                <p>Verde #388e3c: sobre el grupo. Mostaza #a08828: bajo el grupo. El naranjo se descartó — se leía como pariente del coral de identidad.</p>
              </div>
              <div className="dv-lane">
                <span className="label">Categórico · series</span>
                <div className="dv-sw five"><div style={{ background: '#6929c4' }} /><div style={{ background: '#009d9a' }} /><div style={{ background: '#d3354f' }} /><div style={{ background: '#4a62d1' }} /><div style={{ background: '#a56eff' }} /></div>
                <p>Se excluyeron el rojo (pariente del coral) y un verde que colisiona con «sobre el grupo». Sin orden, sin jerarquía.</p>
              </div>
            </div>
          </div>

          <div className="callout"><p>Contraste verificado numéricamente (WCAG 2.2 AA, mínimo 5.74:1). Redundancia 1.4.1: el color nunca codifica juicio solo — elevación, borde y label textual comunican en paralelo.</p></div>
        </section>

        {/* EL PRODUCTO EN USO */}
        <section className="eb-flow sec">
          <p className="eyebrow">El producto en uso</p>
          <h2>Test de Calce, ficha y comparación de colegios</h2>
          <p className="prose">El producto es que una madre entienda cinco dimensiones sin ser experta en política educativa. El Test de Calce y la ficha del colegio ya funcionan sobre datos reales; la comparación de colegios lado a lado está diseñada pero aún sin sustento de datos — es el siguiente paso del ciclo.</p>
          {/* Flujo real del MVP — video + los patrones que lo sostienen */}
          <div className="use-grid">
            <figure className="fig">
              <div className="mk-box"><video ref={video2Ref} className="mk-media" src="/edubig-navegacion-mvp.mp4" autoPlay muted loop playsInline preload="metadata" /></div>
              <figcaption className="figcap">Video 02 · Recorrido del MVP — el Test de Calce y la ficha del colegio en uso, sobre datos reales.</figcaption>
            </figure>
            <div className="patterns">
              <span className="label">Patrones contra el sesgo de deseabilidad social</span>
              <h3>Auto-advance</h3><p>Sin botón «Continuar»: la respuesta es la acción.</p>
              <h3>Nota de legitimación</h3><p>Bloque neutral que valida todas las respuestas en preguntas de alto riesgo de deseabilidad social.</p>
              <h3>Reencuadre lingüístico</h3><p>«Importar» (valor moral) → «necesitar/preferir» (necesidad práctica).</p>
              <h3>Ficha · disclosure progresivo</h3><p>Cuatro módulos en orden fijo (Seguridad → Bienestar → Académico → Trayectoria U.) para hacer comparable cada colegio.</p>
            </div>
          </div>

          {/* Comparar colegios — prototipo (sin datos aún), las dos pantallas en un mismo lienzo */}
          <div className="proto-head">
            <h3>Comparar colegios</h3>
            <span className="mk-tag">Prototipo · datos en proceso</span>
          </div>
          <p className="prose" style={{ marginTop: 4 }}>La comparación lado a lado está diseñada pero aún sin sustento de datos — es el siguiente paso del ciclo.</p>
          <figure className="fig" style={{ marginTop: 18 }}>
            <div className="proto-box">
              <img src={ficha1} alt="Comparar colegios (prototipo, sin datos reales aún) — dimensiones lado a lado y trayectoria" />
              <img src={ficha2} alt="Comparar colegios (prototipo, sin datos reales aún) — universidades de destino y áreas de carrera" />
            </div>
            <figcaption className="figcap">Dimensiones lado a lado · trayectoria universitaria y áreas de carrera de destino.</figcaption>
          </figure>
        </section>

        {/* ESTADO */}
        <section className="eb-flow sec">
          <p className="eyebrow">Estado del proyecto</p>
          <h2>MVP validado · camino a lo nacional</h2>
          <p className="prose">Honestidad sobre qué está probado, qué falta y cuál es el camino. Design Thinking es iterativo: este es el ciclo en el que estoy hoy.</p>
          <div className="grid2">
            <div className="mini">
              <span className="label">Lo validado en el MVP</span>
              <ul className="checklist">
                <li>Motor de scoring recorrido end-to-end con los tres perfiles sobre 57 colegios.</li>
                <li>Auditoría de UX writing en la ficha con heurísticas de Nielsen.</li>
                <li>Verificación WCAG 2.2 AA con cálculo numérico de contraste.</li>
                <li>Sistema de color reorganizado en tres carriles sin colisiones.</li>
              </ul>
            </div>
            <div className="mini warm-mini">
              <span className="label">El gap principal</span>
              <p>Aún no hay testing con familias reales. Sin al menos una ronda documentada, el case study se lee como «concepto bonito» y no como trabajo listo para producir. Es la pieza que hoy decide contrataciones en Product Design — y la próxima del ciclo.</p>
            </div>
          </div>
          <h3 style={{ marginTop: 26 }}>Roadmap inmediato</h3>
          <div className="roadmap">
            <div className="rmi"><span className="rmn">01</span><div><h3>Cerrar el schema con Israel</h3><p>Planilla de 340 campos entregada; en revisión colaborativa hasta cerrar el dataset de 7.168 colegios.</p></div></div>
            <div className="rmi"><span className="rmn">02</span><div><h3>Migrar el frontend al schema nacional</h3><p>Adaptar lib/data y lib/types en Next.js. Recalibrar el motor del quiz con el universo nuevo.</p></div></div>
            <div className="rmi"><span className="rmn">03</span><div><h3>Testear con 5–8 familias</h3><p>Tareas reales sobre el prototipo. Hallazgos por severidad + iteraciones antes/después.</p></div></div>
          </div>
        </section>

        <div className="eb-flow eb-end"><span className="label">Edubig · Case study · Matías Cáceres · 2026</span></div>
      </div>
    </div>
  );
}

const CSS = `
.eb{color:var(--eb-strong);
  --eb-bg:#fafaf7;--eb-surface:#f2f1ec;--eb-surface-2:#ebeae4;--eb-border:#dcdbd5;--eb-border-soft:#ebeae4;--eb-faint:#8a8a85;--eb-medium:#3a3a38;--eb-strong:#0f0f0e;--eb-accent:#5f8f5f;--eb-accent-deep:#456b45;--eb-rdbu-01:#053061;--eb-rdbu-02:#2166ac;--eb-rdbu-09:#d6604d;--eb-exito:#1e6a2e;--eb-advert:#8a6d00;--eb-data-pos:#388e3c;--eb-data-neg:#a08828;--eb-data-neutral:#c8c6bd;
  --eb-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;--eb-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;--eb-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;--eb-max:1000px;}
.eb *{box-sizing:border-box;}
.eb .eb-content{padding:48px 80px 48px 188px;}
@media(max-width:900px){.eb .eb-content{padding:32px 24px;}}
.eb .eb-flow{max-width:var(--eb-max);}
.eb .eb-header{padding-bottom:8px;}
.eb .sec{max-width:var(--eb-max);padding:56px 0;border-top:1px solid var(--eb-border-soft);margin-top:8px;}
.eb .eyebrow{font-family:var(--eb-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--eb-accent-deep);margin:0 0 18px;display:flex;align-items:center;gap:10px;}
.eb .eyebrow::before{content:"";width:22px;height:1px;background:var(--eb-accent);}
.eb h1{font-family:var(--eb-mono-med);font-weight:500;font-size:clamp(40px,7vw,68px);line-height:1;letter-spacing:-.02em;margin:0;}
.eb h2{font-family:var(--eb-mono-med);font-weight:500;font-size:clamp(24px,3.4vw,32px);line-height:1.12;letter-spacing:-.01em;margin:0 0 10px;}
.eb h3{font-family:var(--eb-mono-med);font-weight:500;font-size:18px;line-height:1.25;margin:0 0 6px;}
.eb .lead{font-family:var(--eb-sans);font-size:20px;line-height:1.5;color:var(--eb-medium);margin:14px 0 6px;}
.eb p{font-family:var(--eb-sans);font-size:16px;line-height:1.62;color:var(--eb-medium);margin:0 0 16px;}
.eb p:last-child{margin-bottom:0;}
.eb .prose{max-width:66ch;}
.eb strong{color:var(--eb-strong);font-weight:600;}
.eb em{font-style:italic;}
.eb .label{font-family:var(--eb-mono);font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--eb-faint);}
.eb .figcap{font-family:var(--eb-mono);font-size:11.5px;letter-spacing:.03em;color:var(--eb-faint);margin-top:14px;line-height:1.5;max-width:66ch;}
.eb .brecha .figcap{margin-top:22px;}
.eb .dv-block .figcap{margin-top:18px;}
.eb .fig{margin:0;}
.eb .frame{border:1px solid var(--eb-medium);border-width:1px 4px 4px 1px;border-radius:3px;background:#fff;overflow:hidden;}
.eb .frame img{display:block;width:100%;height:auto;}

/* mockups de teléfono: los PNG ya traen su marco → sin caja, transparentes, mismo alto */
.eb .eb-phone{display:block;height:auto;max-height:560px;width:auto;max-width:100%;}
.eb .eb-cover{margin-top:26px;border:1px solid var(--eb-border);border-radius:6px;overflow:hidden;}
.eb .eb-cover img{display:block;width:100%;height:auto;}
.eb .cover-meta{flex:1;min-width:300px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;}
.eb .cover-meta>div{background:#fff;padding:16px 18px;}
.eb .cover-meta .label{margin-bottom:7px;display:block;}
.eb .cover-meta .val{font-family:var(--eb-sans);font-size:14.5px;line-height:1.35;color:var(--eb-strong);}
.eb .patterns-block{margin-top:16px;}
.eb .patterns-block>.label{display:block;margin-bottom:14px;}
.eb .patterns-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px 30px;}
.eb .patterns-grid h3{margin:0 0 4px;}
.eb .patterns-grid p{margin:0;font-size:14px;}
.eb .eb-mockups{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:26px;align-items:start;}
.eb .mk{margin:0;}
.eb .mk-box{background:#fff;border:1px solid var(--eb-border);border-radius:16px;padding:14px;aspect-ratio:9/16;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.eb .mk-media{width:100%;height:100%;object-fit:contain;display:block;border-radius:8px;}
.eb .mk-tag{display:inline-block;font-family:var(--eb-mono);font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:var(--eb-advert);border:1px solid var(--eb-advert);border-radius:100px;padding:2px 9px;margin-right:8px;vertical-align:1px;}
.eb .proto-head{display:flex;align-items:center;gap:12px;margin-top:44px;}
.eb .proto-head h3{margin:0;}
.eb .proto-box{background:#fff;border:1px solid var(--eb-border);border-radius:18px;padding:28px 26px;display:flex;gap:34px;justify-content:center;align-items:center;flex-wrap:wrap;}
.eb .proto-box img{height:auto;max-height:600px;width:auto;max-width:46%;display:block;border-radius:8px;}

/* videos */
.eb .eb-videoframe{overflow:hidden;background:var(--eb-surface);}
.eb .eb-videoframe.wide{aspect-ratio:16/9;border:1px solid var(--eb-medium);border-width:1px 4px 4px 1px;border-radius:4px;background:#0f0f0e;}
.eb .eb-videoframe.wide video{width:100%;height:100%;object-fit:cover;display:block;}
.eb .eb-videoframe.tall{width:260px;aspect-ratio:9/16;border-radius:30px;border:1px solid var(--eb-border);background:var(--eb-surface);flex:none;}
.eb .eb-videoframe.tall video{width:100%;height:100%;object-fit:cover;display:block;}

.eb .callout{border:none;background:none;border-radius:0;padding:16px 0 0;margin-top:30px;max-width:var(--eb-max);display:grid;grid-template-columns:120px 1fr;gap:26px;border-top:1px solid var(--eb-border);}
.eb .callout::before{content:"Nota";font-family:var(--eb-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--eb-faint);padding-top:3px;}
.eb .callout.warm::before{content:"Advertencia";color:var(--eb-advert);}
.eb .callout p{margin:0;font-size:14.5px;line-height:1.62;color:var(--eb-medium);}
.eb .callout p strong{color:var(--eb-strong);}
.eb .tldr{display:grid;gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:14px;}
.eb .tldr>div{background:#fff;padding:22px 24px;display:grid;grid-template-columns:38px 1fr;gap:16px;align-items:start;}
.eb .tldr .n{font-family:var(--eb-mono);font-size:13px;color:var(--eb-faint);padding-top:3px;}
.eb .grid2{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:14px;}
.eb .mini{border:1px solid var(--eb-border);border-radius:3px;padding:20px 22px;background:#fff;}
.eb .mini.warm-mini{border-left:3px solid var(--eb-rdbu-09);}
.eb .mini .label{display:block;margin-bottom:12px;}
.eb ul.ticks,.eb ul.checklist{list-style:none;padding:0;margin:0;}
.eb ul.ticks li,.eb ul.checklist li{position:relative;padding-left:24px;margin-bottom:10px;font-family:var(--eb-sans);font-size:15px;color:var(--eb-medium);line-height:1.45;}
.eb ul.ticks li::before{content:"";position:absolute;left:0;top:8px;width:7px;height:7px;border-radius:50%;background:var(--eb-accent);}
.eb ul.checklist li::before{content:"";position:absolute;left:0;top:3px;width:14px;height:14px;border:1.5px solid var(--eb-exito);border-radius:3px;background:linear-gradient(45deg,transparent 45%,var(--eb-exito) 45%,var(--eb-exito) 55%,transparent 55%),linear-gradient(-45deg,transparent 45%,var(--eb-exito) 45%,var(--eb-exito) 55%,transparent 55%);}
.eb .sources{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:14px;}
.eb .source{border:1px solid var(--eb-border);border-radius:3px;padding:14px 12px;background:#fff;}
.eb .source .nm{font-family:var(--eb-mono);font-size:14px;color:var(--eb-strong);margin-bottom:5px;}
.eb .source .sub{font-family:var(--eb-sans);font-size:12px;line-height:1.35;color:var(--eb-faint);}
.eb .evid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:14px;}
.eb .evid>div{background:#fff;padding:18px 20px;}
.eb .evid .es{font-family:var(--eb-mono);font-size:13.5px;color:var(--eb-strong);margin-bottom:4px;}
.eb .evid .en{font-family:var(--eb-mono);font-size:11px;color:var(--eb-faint);margin-bottom:8px;}
.eb .evid .ed{font-family:var(--eb-sans);font-size:13.5px;line-height:1.45;color:var(--eb-medium);}
.eb .pv-lead{font-family:var(--eb-mono);font-size:13px;color:var(--eb-accent-deep);margin:22px 0 0;}
.eb .pv{margin-top:12px;}
.eb .pv-frame{position:relative;display:block;width:100%;padding:0;border:1px solid var(--eb-border);border-radius:4px;overflow:hidden;background:#fff;cursor:pointer;}
.eb .pv-frame img{display:block;width:100%;height:auto;transition:transform .5s ease;}
.eb .pv-frame:hover img,.eb .pv-frame:focus-visible img{transform:scale(1.015);}
.eb .pv-frame:focus-visible{outline:2px solid var(--eb-strong);outline-offset:2px;}
.eb .pv-hint{position:absolute;right:14px;bottom:14px;background:rgba(15,15,14,.88);color:#fff;padding:8px 15px;border-radius:100px;font-family:var(--eb-mono);font-size:12px;letter-spacing:.02em;opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease;pointer-events:none;}
.eb .pv-frame:hover .pv-hint,.eb .pv-frame:focus-visible .pv-hint{opacity:1;transform:translateY(0);}
.eb .pv-controls{display:flex;align-items:center;justify-content:space-between;margin-top:14px;gap:12px;flex-wrap:wrap;}
.eb .pv-dots{display:flex;gap:8px;align-items:center;}
.eb .pv-dot{width:9px;height:9px;border-radius:50%;background:var(--eb-border);border:1px solid var(--eb-border);padding:0;cursor:pointer;}
.eb .pv-dot.active{background:var(--eb-accent);border-color:var(--eb-accent);}
.eb .pv-name{font-family:var(--eb-mono);font-size:12px;color:var(--eb-faint);margin-left:4px;}
.eb .pv-nav{display:flex;gap:8px;}
.eb .pv-btn{font-family:var(--eb-mono);font-size:15px;line-height:1;border:1px solid var(--eb-medium);border-width:1px 3px 3px 1px;background:#fff;border-radius:2px;padding:7px 13px;cursor:pointer;color:var(--eb-medium);}
.eb .pv-btn:hover{color:var(--eb-strong);}
.eb .pains{display:grid;margin-top:14px;border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;}
.eb .pain{display:grid;grid-template-columns:34px 1fr;gap:16px;padding:15px 20px;border-top:1px solid var(--eb-border-soft);background:#fff;}
.eb .pain:first-child{border-top:none;}
.eb .pain .pn{font-family:var(--eb-mono);font-size:12px;color:var(--eb-faint);padding-top:2px;}
.eb .pain .ph{font-family:var(--eb-mono);font-size:14px;color:var(--eb-strong);}
.eb .pain .pd{font-family:var(--eb-sans);font-size:13.5px;color:var(--eb-medium);line-height:1.45;}
.eb .chain3{display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid var(--eb-border);border-radius:4px 4px 0 0;overflow:hidden;margin-top:14px;}
.eb .chain3 .cc{padding:24px 18px;text-align:center;border-left:1px solid rgba(255,255,255,.5);}
.eb .chain3 .cc:first-child{border-left:none;}
.eb .chain3 .cc.input{background:linear-gradient(180deg,#eef5f9,#e3eef5);}
.eb .chain3 .cc.bridge{background:#fbfbf9;}
.eb .chain3 .cc.output{background:linear-gradient(180deg,#fbeee9,#f7e1d9);}
.eb .chain3 .cch{font-family:var(--eb-mono);font-size:11px;letter-spacing:.11em;text-transform:uppercase;margin-bottom:16px;}
.eb .chain3 .input .cch{color:var(--eb-rdbu-01);}
.eb .chain3 .bridge .cch{color:var(--eb-strong);}
.eb .chain3 .output .cch{color:var(--eb-rdbu-09);}
.eb .chain3 .w{font-family:var(--eb-mono);font-size:15px;color:var(--eb-strong);margin:0;}
.eb .chain3 .a{color:var(--eb-faint);font-size:12px;margin:5px 0;}
.eb .resolve{background:var(--eb-strong);color:var(--eb-bg);text-align:center;padding:20px;border-radius:0 0 4px 4px;font-family:var(--eb-mono);font-weight:500;font-size:clamp(16px,2.6vw,22px);letter-spacing:-.01em;}
.eb .palette{display:flex;border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:18px;}
.eb .palette .p{flex:1;height:40px;}
.eb .logo-beats{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:stretch;margin-top:14px;}
.eb .toggle-demo{border:none;background:none;padding:8px 0;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.eb .toggle-demo .label{margin-bottom:18px;}
.eb .tg{border:none;background:none;padding:0;cursor:pointer;display:inline-block;line-height:0;}
.eb .tg-track{display:block;width:172px;height:78px;border-radius:100px;position:relative;background:linear-gradient(90deg,#2166ac,#67a9cf);box-shadow:inset 0 1px 3px rgba(0,0,0,.18);transition:background .45s ease;}
.eb .tg.is-on .tg-track{background:linear-gradient(90deg,#2166ac,#d1e5f0 42%,#fddbc7 58%,#d6604d);}
.eb .tg-knob{position:absolute;top:6px;left:6px;width:66px;height:66px;border-radius:50%;background:#fff;box-shadow:0 2px 7px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-family:var(--eb-mono);font-weight:600;font-size:14px;color:var(--eb-rdbu-02);transition:left .45s cubic-bezier(.6,.2,.1,1),color .45s ease;}
.eb .tg.is-on .tg-knob{left:100px;color:var(--eb-rdbu-09);}
.eb .tg-state{font-family:var(--eb-mono);font-size:12px;letter-spacing:.09em;text-transform:uppercase;margin-top:18px;color:var(--eb-rdbu-02);}
.eb .tg-state.on{color:var(--eb-rdbu-09);}
.eb .promises{position:relative;margin-top:14px;}
.eb .promises::before{content:"";position:absolute;top:0;left:6%;right:6%;height:1px;background:var(--eb-accent);}
.eb .promise-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;padding-top:26px;}
.eb .promise .dot{width:9px;height:9px;border-radius:50%;background:var(--eb-accent);margin-bottom:14px;}
.eb .promise .tag{font-family:var(--eb-mono);font-size:10.5px;letter-spacing:.08em;color:var(--eb-faint);text-transform:uppercase;margin-top:12px;display:block;}
.eb .decision{border:1px solid var(--eb-border);border-radius:4px;overflow:hidden;margin-top:20px;}
.eb .decision .dhead{padding:16px 20px;background:#fff;border-bottom:1px solid var(--eb-border);}
.eb .decision .dhead .label{color:var(--eb-accent-deep);}
.eb .decision .dhead h3{margin:6px 0 0;}
.eb .decision .drow{display:grid;grid-template-columns:120px 1fr;gap:18px;padding:16px 20px;border-top:1px solid var(--eb-border-soft);}
.eb .decision .drow:first-of-type{border-top:none;}
.eb .decision .rk{font-family:var(--eb-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding-top:2px;}
.eb .rk.no{color:var(--eb-rdbu-09);}
.eb .rk.yes{color:var(--eb-exito);}
.eb .rk.trade{color:var(--eb-advert);}
.eb .decision .rv{font-family:var(--eb-sans);font-size:15px;line-height:1.5;color:var(--eb-medium);}
.eb .pipe{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:14px;margin-top:20px;}
.eb .pipe .node{border:1px solid var(--eb-border);border-radius:3px;padding:16px;text-align:center;background:#fff;}
.eb .pipe .node .nt{font-family:var(--eb-mono);font-size:13px;color:var(--eb-strong);margin-bottom:4px;}
.eb .pipe .node .nd{font-family:var(--eb-sans);font-size:11.5px;color:var(--eb-faint);line-height:1.35;}
.eb .pipe .node.hi{border-color:var(--eb-accent);background:rgba(95,143,95,.06);}
.eb .pipe .arw{font-family:var(--eb-mono);color:var(--eb-faint);font-size:18px;text-align:center;}
.eb .brecha{border:1px solid var(--eb-border);border-radius:4px;padding:22px;margin-top:14px;background:#fff;}
.eb .brecha-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px;}
.eb .brecha-rows{display:flex;flex-direction:column;gap:14px;}
.eb .brow{display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:center;}
.eb .bname{font-family:var(--eb-mono);font-size:13px;color:var(--eb-strong);display:flex;flex-direction:column;gap:3px;}
.eb .warnchip{font-family:var(--eb-mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--eb-advert);}
.eb .btrack{position:relative;height:26px;}
.eb .baxis{position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:var(--eb-medium);}
.eb .bbar{position:absolute;top:4px;bottom:4px;border-radius:2px;}
.eb .bbar.pos{background:var(--eb-data-pos);}
.eb .bbar.neg{background:var(--eb-data-neg);}
.eb .bval{position:absolute;top:50%;transform:translateY(-50%);font-family:var(--eb-mono);font-size:12px;font-variant-numeric:tabular-nums;}
.eb .bval.pos{color:var(--eb-data-pos);}
.eb .bval.neg{color:var(--eb-data-neg);}
.eb .brecha-scale{display:flex;justify-content:space-between;margin-top:18px;padding-left:166px;font-family:var(--eb-mono);font-size:10px;color:var(--eb-faint);}
.eb .dotlg{display:inline-block;width:9px;height:9px;border-radius:2px;vertical-align:middle;}
.eb .dotlg.pos{background:var(--eb-data-pos);}
.eb .dotlg.neg{background:var(--eb-data-neg);}
.eb .rails{border:1px solid var(--eb-border);border-radius:4px;padding:4px 20px;margin-top:14px;background:#fff;}
.eb .rail{display:grid;grid-template-columns:150px 1fr;gap:20px;padding:18px 0;border-top:1px solid var(--eb-border-soft);align-items:center;}
.eb .rail:first-child{border-top:none;}
.eb .rail .rlab .label{display:block;margin-bottom:3px;}
.eb .rail .rlab .rn{font-family:var(--eb-mono);font-size:14px;color:var(--eb-strong);}
.eb .swatches{display:flex;border-radius:3px;overflow:hidden;height:32px;border:1px solid var(--eb-border);}
.eb .swatches.series{gap:8px;border:none;height:auto;}
.eb .swatches .sw{flex:1;}
.eb .swatches.series .sw{border-radius:3px;height:32px;display:flex;align-items:flex-end;padding:5px 8px;}
.eb .swatches.series .sw span{font-family:var(--eb-mono);font-size:10px;color:#fff;}
.eb .rail .rdesc{font-family:var(--eb-sans);font-size:13px;color:var(--eb-medium);line-height:1.45;margin-top:8px;}
.eb .use-grid{display:grid;grid-template-columns:260px 1fr;gap:32px;margin-top:14px;align-items:start;}
.eb .patterns .label{display:block;margin-bottom:12px;}
.eb .patterns h3{margin-top:14px;}
.eb .patterns h3:first-of-type{margin-top:0;}
.eb .roadmap{margin-top:8px;}
.eb .rmi{display:grid;grid-template-columns:32px 1fr;gap:16px;padding:16px 0;border-top:1px solid var(--eb-border-soft);}
.eb .rmi:first-child{border-top:none;}
.eb .rmi .rmn{font-family:var(--eb-mono);font-size:13px;color:var(--eb-accent-deep);padding-top:2px;}
.eb .learns{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:14px;}
.eb .learns>div{background:#fff;padding:22px;}
.eb .eb-end{margin-top:48px;padding-top:24px;border-top:1px solid var(--eb-border-soft);}
.eb .dv-block{border:1px solid var(--eb-border);border-radius:4px;background:#fff;padding:26px 28px;margin-top:18px;}
.eb .dv-head{display:flex;justify-content:space-between;align-items:baseline;gap:20px;margin-bottom:16px;flex-wrap:wrap;}
.eb .dv-block h3{margin:0 0 8px;}
.eb .dv-block>p:not(.figcap){font-size:15px;max-width:66ch;}
.eb .dv-compare{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:18px;}
.eb .dv-panel{position:relative;border:1px dashed var(--eb-border);border-radius:3px;padding:22px 20px 20px;}
.eb .dv-panel.chosen{border-style:solid;border-color:var(--eb-medium);}
.eb .dv-tag{position:absolute;top:-9px;left:18px;background:#fff;padding:0 8px;font-family:var(--eb-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--eb-faint);}
.eb .dv-panel.chosen .dv-tag{color:var(--eb-strong);}
.eb .dv-panel h4{font-family:var(--eb-mono);font-weight:500;font-size:14px;margin:0 0 14px;color:var(--eb-medium);}
.eb .dv-panel .dv-why{font-size:13px;color:var(--eb-faint);margin:12px 0 0;line-height:1.5;}
.eb .dv-parallel{position:relative;height:108px;border-bottom:1px solid var(--eb-border-soft);}
.eb .pl-line{position:absolute;left:0;right:0;height:2px;}
.eb .pl-line.colegio{top:32%;background:var(--eb-data-pos);}
.eb .pl-line.similares{top:64%;background:var(--eb-data-neutral);}
.eb .pl-line span{position:absolute;right:0;top:-15px;font-family:var(--eb-mono);font-size:10.5px;color:var(--eb-faint);}
.eb .pl-gap{position:absolute;left:62%;top:32%;bottom:36%;border-left:1px dotted var(--eb-faint);}
.eb .pl-gap::after{content:"resta mental";position:absolute;left:6px;top:6px;font-family:var(--eb-mono);font-size:10px;color:var(--eb-faint);white-space:nowrap;}
.eb .dv-minigap{position:relative;height:108px;}
.eb .mg-axis{position:absolute;top:0;bottom:18px;left:50%;width:1px;background:var(--eb-border);}
.eb .mg-bar{position:absolute;left:50%;top:calc(50% - 9px);height:16px;width:32%;background:var(--eb-data-pos);border-radius:0 2px 2px 0;}
.eb .mg-val{position:absolute;left:calc(50% + 32% + 8px);top:calc(50% - 8px);font-family:var(--eb-mono);font-size:12px;color:var(--eb-strong);}
.eb .mg-zero{position:absolute;bottom:0;left:50%;transform:translateX(-50%);font-family:var(--eb-mono);font-size:10px;color:var(--eb-faint);}
.eb .dv-wells{display:grid;gap:20px;margin-top:18px;}
.eb .dv-wellgroup{display:grid;grid-template-columns:130px 1fr;gap:14px;align-items:center;}
.eb .dv-wname{font-family:var(--eb-mono);font-size:13px;color:var(--eb-strong);}
.eb .dv-wcol{display:flex;flex-direction:column;gap:7px;}
.eb .dv-well{display:grid;grid-template-columns:1fr 34px;gap:10px;align-items:center;}
.eb .dv-wtrack{position:relative;height:15px;background:var(--eb-border-soft);border-radius:2px;overflow:hidden;}
.eb .dv-wfill{position:absolute;left:0;top:0;bottom:0;}
.eb .dv-wfill.colegio{background:var(--eb-data-pos);}
.eb .dv-wfill.similares{background:var(--eb-data-neutral);}
.eb .dv-wfill.nacional{background:transparent;box-shadow:inset 0 0 0 1.5px var(--eb-faint);}
.eb .dv-wv{font-family:var(--eb-mono);font-size:12px;color:var(--eb-medium);text-align:right;font-variant-numeric:tabular-nums;}
.eb .dv-welllegend{display:flex;gap:22px;margin-top:20px;flex-wrap:wrap;}
.eb .dv-welllegend .lg{font-family:var(--eb-mono);font-size:11px;color:var(--eb-faint);display:flex;align-items:center;gap:6px;}
.eb .dv-welllegend .lg::before{content:"";width:11px;height:11px;border-radius:2px;}
.eb .dv-welllegend .lg.colegio::before{background:var(--eb-data-pos);}
.eb .dv-welllegend .lg.similares::before{background:var(--eb-data-neutral);}
.eb .dv-welllegend .lg.nacional::before{background:transparent;box-shadow:inset 0 0 0 1.5px var(--eb-faint);}
.eb .dv-gse{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:18px;align-items:start;}
.eb .dv-gsemap{position:relative;height:170px;border-bottom:1px solid var(--eb-border-soft);}
.eb .gse-band{position:absolute;left:8%;right:8%;top:38%;height:48px;background:repeating-linear-gradient(90deg,var(--eb-border-soft) 0 4px,transparent 4px 8px);}
.eb .gse-dot{position:absolute;width:10px;height:10px;border-radius:50%;background:var(--eb-faint);transform:translate(-50%,-50%);}
.eb .gse-dot.focus{width:14px;height:14px;background:var(--eb-data-pos);}
.eb .gse-lab{position:absolute;font-family:var(--eb-mono);font-size:11px;color:var(--eb-strong);transform:translateX(-50%);white-space:nowrap;}
.eb .gse-lab.sub{color:var(--eb-faint);}
.eb .dv-gsemap.small .gse-warn{position:absolute;left:6%;right:6%;top:50%;transform:translateY(-50%);border:1px solid var(--eb-data-neg);border-radius:3px;padding:12px 14px;font-family:var(--eb-mono);font-size:11.5px;line-height:1.5;color:var(--eb-data-neg);background:#fff;}
.eb .dv-lanes{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:18px;}
.eb .dv-lane{border:1px solid var(--eb-border-soft);border-radius:3px;padding:16px 18px;}
.eb .dv-lane>.label{display:block;margin-bottom:12px;}
.eb .dv-sw{display:flex;height:18px;border-radius:2px;overflow:hidden;margin-bottom:12px;}
.eb .dv-sw div{flex:1;}
.eb .dv-sw.five{gap:6px;overflow:visible;}
.eb .dv-sw.five div{border-radius:2px;}
.eb .dv-lane p{font-size:12.5px;color:var(--eb-faint);margin:0;line-height:1.5;}
@media(max-width:820px){
  .eb .cover-meta,.eb .grid2,.eb .logo-beats,.eb .use-grid,.eb .evid,.eb .promise-grid,.eb .learns,.eb .patterns-grid{grid-template-columns:1fr;}
  .eb .dv-compare,.eb .dv-gse,.eb .dv-lanes{grid-template-columns:1fr;}
  .eb .dv-wellgroup{grid-template-columns:1fr;gap:8px;}
  .eb .callout{grid-template-columns:1fr;gap:8px;}
  .eb .proto-box img{max-width:100%;max-height:70vh;}
  .eb .eb-mockups{grid-template-columns:1fr;max-width:300px;margin-left:auto;margin-right:auto;}
  .eb .sources{grid-template-columns:repeat(2,1fr);}
  .eb .chain3,.eb .pipe{grid-template-columns:1fr;}
  .eb .pipe .arw{transform:rotate(90deg);}
  .eb .brow{grid-template-columns:1fr;gap:6px;}
  .eb .brecha-scale{padding-left:0;}
  .eb .rail{grid-template-columns:1fr;gap:10px;}
  .eb .eb-hero{gap:24px;}
}
@media(prefers-reduced-motion:reduce){.eb .tg-track,.eb .tg-knob,.eb .pv-frame img,.eb .pv-hint{transition:none;}}
`;
