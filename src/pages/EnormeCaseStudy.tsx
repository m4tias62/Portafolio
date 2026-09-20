import { useEffect, useRef, useState } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import portada from '@/assets/enorme/portada.jpg';
import spread1540 from '@/assets/enorme/spread-1540s.jpg';
import spread1550 from '@/assets/enorme/spread-1550s.jpg';
import spread1560 from '@/assets/enorme/spread-1560s.jpg';
import spread1570 from '@/assets/enorme/spread-1570s.jpg';
import spread1570detalle from '@/assets/enorme/spread-1570s-detalle.jpg';
import creditos from '@/assets/enorme/creditos.jpg';

/**
 * EnormeCaseStudy — segundo case study editorial dedicado.
 * Adapta la maqueta de Claude Design (Enorme Case Study.dc.html) a los
 * esenciales del portafolio: NavBar heredada arriba (App.tsx), ProgressBar
 * vertical fijo a la izquierda, BackButton "Volver al listado" en el
 * arranque del contenido, padding pl-[188px] y fuentes IBM Plex reales.
 * Todo el CSS propio vive bajo `.en` para no filtrar al resto del site.
 * El mundo rosa/magenta/celeste del libro se conserva en el hero, la sección
 * "sistema de marca" y el spread 1550s; la narrativa (encargo, desafío,
 * objetivo, proceso, cierre) vive en cremita como el resto del portafolio.
 */

type Spread = {
  key: string;
  decade: string;
  spreadNo: string;
  bgNote: string;
  desc: string;
  img: string;
  imgAlt: string;
  cap: string;
  extraImg?: string;
  extraAlt?: string;
  extraCap?: string;
  hits: {
    label: 'Cultura popular' | 'Personajes y sucesos' | 'Ciencia y tecnología';
    dotColor: string;
    items: { year: string; text: string }[] | null;
    note?: string;
  }[];
};

const SPREADS: Spread[] = [
  {
    key: '1540s',
    decade: 'Década de 1540s',
    spreadNo: 'Spread 01 · fondo crema',
    bgNote: 'crema + plano celeste',
    desc: 'La década en que el Renacimiento tardío convive con la expansión colonial en América. El spread se resuelve sobre papel crema: ilustración a línea, un solo plano celeste y el número en rosa cruzando el lomo.',
    img: spread1540,
    imgAlt: 'Spread de la década de 1540s con ilustraciones a línea, figura en celeste y número 1540s en rosa',
    cap: 'Fig. 01 · Spread 1540s, papel crema + plano celeste',
    hits: [
      {
        label: 'Cultura popular',
        dotColor: '#ef82bb',
        items: [{ year: '41', text: 'El Juicio Final, Miguel Ángel — Capilla Sixtina' }],
      },
      {
        label: 'Personajes y sucesos',
        dotColor: '#0f0f0e',
        items: [
          { year: '41', text: 'Ocurre la fundación de Arica' },
          { year: '42', text: 'Francisco Orellana desciende el Amazonas' },
        ],
      },
      {
        label: 'Ciencia y tecnología',
        dotColor: '#a8d4ea',
        items: [{ year: '41', text: 'Revolución de las orbes celestes' }],
      },
    ],
  },
  {
    key: '1550s',
    decade: 'Década de 1550s',
    spreadNo: 'Spread 02 · fondo rosa saturado',
    bgNote: 'rosa a sangre + tinta negra',
    desc: 'El spread más dramático de la serie: una sola imagen a sangre, las momias de Teruel en tinta negra sobre rosa saturado, con el número en blanco girado sobre el eje de lectura. Es la excepción que el sistema permite una vez por bloque.',
    img: spread1550,
    imgAlt: 'Spread de la década de 1550s: ilustración de momias en negro sobre fondo rosa saturado y número 1550s en blanco',
    cap: 'Fig. 02 · Spread 1550s, rosa a sangre + tinta negra',
    hits: [
      { label: 'Cultura popular', dotColor: '#ef82bb', items: null, note: 'Carril cedido a la imagen' },
      {
        label: 'Personajes y sucesos',
        dotColor: '#0f0f0e',
        items: [{ year: '55', text: 'Se encuentran las momias de Teruel' }],
      },
      { label: 'Ciencia y tecnología', dotColor: '#a8d4ea', items: null, note: 'Carril cedido a la imagen' },
    ],
  },
  {
    key: '1560s',
    decade: 'Década de 1560s',
    spreadNo: 'Spread 03 · fondo crema',
    bgNote: 'cinco hitos en tres carriles',
    desc: 'El spread más denso: cinco hitos repartidos en los tres carriles, con la Torre de Babel en celeste como pieza central y el levantamiento mapuche cerrando a la derecha. Sirvió de prueba de carga del sistema.',
    img: spread1560,
    imgAlt: 'Spread de la década de 1560s con Torre de Babel en celeste, retrato de Shakespeare y número 1560s en rosa',
    cap: 'Fig. 03 · Spread 1560s, cinco hitos en tres carriles',
    hits: [
      {
        label: 'Cultura popular',
        dotColor: '#ef82bb',
        items: [
          { year: '63', text: 'Pintura de la Torre de Babel, Pieter Brueghel' },
          { year: '64', text: 'Nace William Shakespeare en Reino Unido' },
        ],
      },
      {
        label: 'Personajes y sucesos',
        dotColor: '#0f0f0e',
        items: [
          { year: '66', text: 'Nace James I en Inglaterra' },
          { year: '62', text: 'Levantamiento mapuche contra españoles' },
        ],
      },
      {
        label: 'Ciencia y tecnología',
        dotColor: '#a8d4ea',
        items: [{ year: '65', text: 'Se inventa el mosquete en Alemania' }],
      },
    ],
  },
  {
    key: '1570s',
    decade: 'Década de 1570s',
    spreadNo: 'Spread 04 · crema + rosa y celeste',
    bgNote: 'plano celeste como paisaje',
    desc: 'Cierre del bloque: el plano de color deja de ser acento y se vuelve paisaje — el celeste como follaje detrás del número, el rosa tiñendo turbante y retrato. La rueda hilandera cruza el lomo por abajo.',
    img: spread1570,
    imgAlt: 'Spread de la década de 1570s con retrato de Mulla Sadra, teatro isabelino y número 1570s en rosa',
    cap: 'Fig. 04 · Spread 1570s, vista general',
    extraImg: spread1570detalle,
    extraAlt: 'Detalle del spread 1570s: follaje en celeste, conquistadores en tinta negra e iglesia San Francisco',
    extraCap: 'Fig. 05 · Detalle, plano celeste como paisaje',
    hits: [
      {
        label: 'Cultura popular',
        dotColor: '#ef82bb',
        items: [
          { year: '76', text: 'Se construye el Teatro Isabelino' },
          { year: '73', text: 'Se construye la Iglesia San Francisco' },
        ],
      },
      {
        label: 'Personajes y sucesos',
        dotColor: '#0f0f0e',
        items: [
          { year: '72', text: 'Nace Mulla Sadra en Irán' },
          { year: '71', text: 'La Inquisición llega a América' },
          { year: '70', text: 'Acontece la conquista de Perú' },
        ],
      },
      {
        label: 'Ciencia y tecnología',
        dotColor: '#a8d4ea',
        items: [
          { year: '78', text: 'Nace William Harvey en Reino Unido' },
          { year: '70', text: 'Inundación de Todos los Santos, Holanda' },
        ],
      },
    ],
  },
];

const PALETTE: [string, string, string][] = [
  ['#ef82bb', 'Rosa chicle', '#EF82BB'],
  ['#f4a3c8', 'Rosa claro', '#F4A3C8'],
  ['#5a1836', 'Magenta oscuro', '#5A1836'],
  ['#a8d4ea', 'Celeste', '#A8D4EA'],
  ['#0f0f0e', 'Tinta', '#0F0F0E'],
  ['#efeee7', 'Papel crema', '#EFEEE7'],
];

const OBJETIVOS: [string, string][] = [
  ['Simultaneidad', 'Ver en una sola página lo que pasaba al mismo tiempo en ciencia, cultura y política.'],
  ['Síntesis', 'Cada hito cabe en cuatro datos: año, acción, entidad y lugar. Nada más.'],
  ['Deseo', 'Un objeto que uno quiera tener en la mano: tapa dura, bolsillo, rosa saturado.'],
];

const PROCESO: [string, string, string][] = [
  ['01', 'Reparto de décadas y grilla común', 'Antes de ilustrar nada se fijó la grilla: tres carriles, posición del folio, caja del número de década y la ficha de metadato. Cada autor recibió su década con la maqueta ya armada.'],
  ['02', 'Investigación y selección de hitos', 'Entre cuatro y seis hechos por década, cruzando Europa con América — que la línea de tiempo no fuera solo occidental fue una decisión explícita del taller.'],
  ['03', 'Ilustración a mano, tinta negra', 'Todo dibujado a mano con pincel y tinta, buscando el gesto del linograbado contemporáneo: línea gruesa, bordes mordidos, sin degradados. La mano es el denominador común entre veinte estilos.'],
  ['04', 'Planos de color por encima', 'El color nunca rellena el dibujo: se monta como una plancha aparte, corrida respecto de la línea. Máximo un plano celeste y uno rosa por spread.'],
  ['05', 'Revisión cruzada y cierre de arte', 'Revisiones colectivas por bloques de siglo para detectar spreads que se salían de tono, y ajuste final de tintas antes de la prueba de imprenta.'],
];

export default function EnormeCaseStudy({ onBack }: { onBack: () => void }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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

  function handleSeek(ratio: number, dragging = false) {
    const el = contentRef.current;
    if (!el) return;
    const scrollable = el.getBoundingClientRect().height - window.innerHeight;
    if (scrollable > 0) {
      window.scrollTo({ top: el.offsetTop + ratio * scrollable, behavior: dragging ? 'auto' : 'smooth' });
    }
  }

  return (
    <div className="en bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(11)} />
      </div>

      <div ref={contentRef} className="en-content">
        <div style={{ marginBottom: 32 }}>
          <BackButton onClick={onBack} label="Volver al listado" />
        </div>

        {/* Header — mismo formato que Tuxpan */}
        <header className="en-flow en-header">
          <p className="eyebrow">Proyecto 10 · Diseño editorial · 2023</p>
          <h1>ENORME — Historia de Bolsillo</h1>
          <p className="lead">Un libro ilustrado que reordena la historia universal en líneas de tiempo por década. Veinte diseñadores, un solo sistema visual.</p>
          <p className="prose">
            Producto editorial universitario con distribución real por Editorial Cataloma, hecho como parte del Taller Editorial Ilustrado de la FAAD-UDP. Cada diseñador tomó a su cargo un puñado de décadas, ilustró a mano y compuso su spread dentro de una grilla común. Me tocaron las décadas de 1540 a 1570 — Edad Moderna, Arte Gótico.
          </p>

          {/* Meta grid — 4 columnas */}
          <div className="meta4">
            <div>
              <span className="mk">Año</span>
              <span className="mv">2023<em>Primera edición, diciembre</em></span>
            </div>
            <div>
              <span className="mk">Rol</span>
              <span className="mv">Diseñador e ilustrador<em>colaborador</em></span>
            </div>
            <div>
              <span className="mk">Cliente</span>
              <span className="mv">Editorial Cataloma<em>Taller Editorial Ilustrado, FAAD · UDP</em></span>
            </div>
            <div>
              <span className="mk">Formato</span>
              <span className="mv">Tapa dura, bolsillo<em>Implementa Boutique Gráfica</em></span>
            </div>
          </div>
        </header>

        {/* Hero — mundo rosa del libro con portada + spread destacado */}
        <section className="en-hero-sec">
          <div className="en-hero">
            <div className="en-hero-grid">
              <figure className="en-hero-fig">
                <img src={portada} alt="Portada de ENORME — Historia de Bolsillo" />
              </figure>
              <figure className="en-hero-fig">
                <img src={spread1560} alt="Spread interior de la década de 1560s" />
              </figure>
            </div>
            <p className="en-hero-cap">Portada + spread 1560s · Edad Moderna / Arte Gótico</p>
          </div>
        </section>

        {/* Encargo · Desafío · Objetivo — mismo trío que Tuxpan */}
        <section className="en-flow sec">
          <div className="trio">
            <div>
              <p className="eyebrow mag">01 · Encargo</p>
              <h3>Rediseñar la forma en que se cuenta la historia</h3>
              <p className="prose">Un libro didáctico y atractivo que reemplace la estética densa del manual escolar por un sistema visual contemporáneo, capaz de poner en una misma línea de tiempo hitos científicos, culturales, deportivos, artísticos y políticos. No un ejercicio de aula: producto editorial universitario con distribución real por Editorial Cataloma, impreso en tapa dura y formato bolsillo.</p>
            </div>
            <div>
              <p className="eyebrow mag">02 · Desafío</p>
              <h3>Sostener un sistema en un proyecto colectivo de veinte manos</h3>
              <p className="prose">Cada spread es autor-designer: ilustración propia, composición propia, criterio propio. Pero todos tienen que leerse como el mismo libro. La coherencia no podía venir del estilo de mano — venía de la grilla, del sistema de carriles, del tratamiento del número de década y de una paleta cerrada.</p>
              <div className="chip-row">
                <span className="mono-lbl">Décadas asignadas</span>
                <span className="chip">1540s</span>
                <span className="chip">1550s</span>
                <span className="chip">1560s</span>
                <span className="chip">1570s</span>
              </div>
            </div>
            <div>
              <p className="eyebrow mag">03 · Objetivo</p>
              <h3>Didáctica visual: entender mirando, no estudiando</h3>
              <div className="obj-grid">
                {OBJETIVOS.map(([k, v]) => (
                  <div key={k} className="obj-card">
                    <span className="mk">{k}</span>
                    <p>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sistema de marca del libro */}
        <section className="en-flow sec">
          <p className="eyebrow mag">04 · Sistema de marca del libro</p>
          <h2>Cerrado y corto, para que veinte manos no lo rompieran</h2>
          <p className="prose">Cuatro tintas, dos pesos tipográficos, tres carriles. Cuanto más restringido el sistema, más margen para el gesto propio de cada autor.</p>

          <div className="palette">
            {PALETTE.map(([hex, name, code]) => (
              <div key={hex} className="sw">
                <div className="chip-big" style={{ background: hex, border: hex === '#efeee7' ? '1px solid #dcdbd5' : 'none' }} />
                <div className="sw-meta">
                  <span className="sw-name">{name}</span>
                  <span className="sw-hex">{code}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sys-grid">
            <div className="sys-card">
              <span className="mono-lbl">Espécimen · número de década</span>
              <div className="specimen">
                <div className="sp-big" style={{ color: '#ef82bb' }}>1560s</div>
                <div className="sp-md" style={{ color: '#f4a3c8' }}>1570s</div>
              </div>
              <p className="prose sm">Grotesca condensada a peso total del spread, siempre cruzando el lomo. Es el único elemento que ocupa las dos páginas y el que amarra la lectura entre décadas.</p>
            </div>
            <div className="sys-card gray">
              <span className="mono-lbl">Anatomía del hito</span>
              <div className="anat">
                <span className="anat-num">64</span>
                <span className="anat-body">
                  <span className="anat-verb">Nace</span>
                  <strong>William Shakespeare</strong>
                  <span className="anat-loc">en Reino Unido</span>
                </span>
              </div>
              <ul className="anat-list">
                <li>01 — Año (dos dígitos)</li>
                <li>02 — Verbo / acción</li>
                <li>03 — Entidad</li>
                <li>04 — Lugar</li>
              </ul>
              <p className="prose sm">Metadato siempre en el mismo orden, en cuatro líneas máximo. La restricción es lo que hace comparable un spread con otro.</p>
            </div>
          </div>
        </section>

        {/* Los cuatro spreads */}
        <section className="en-flow sec">
          <p className="eyebrow mag">05 · Los cuatro spreads</p>
          <h2>Edad Moderna / Arte Gótico</h2>
          <p className="prose">Una década por spread, tres carriles horizontales de lectura: cultura popular arriba, personajes y sucesos al medio, ciencia y tecnología abajo.</p>

          {SPREADS.map((sp) => (
            <article className="spread" key={sp.key}>
              <div className="spread-head">
                <h3>{sp.decade}</h3>
                <span className="mono-lbl">{sp.spreadNo}</span>
              </div>
              <p className="prose">{sp.desc}</p>

              {sp.extraImg ? (
                <div className="spread-two">
                  <figure className="fig">
                    <div className="fig-frame"><img src={sp.img} alt={sp.imgAlt} /></div>
                    <figcaption>{sp.cap}</figcaption>
                  </figure>
                  <figure className="fig">
                    <div className="fig-frame"><img src={sp.extraImg} alt={sp.extraAlt} /></div>
                    <figcaption>{sp.extraCap}</figcaption>
                  </figure>
                </div>
              ) : (
                <figure className="fig">
                  <div className="fig-frame"><img src={sp.img} alt={sp.imgAlt} /></div>
                  <figcaption>{sp.cap}</figcaption>
                </figure>
              )}

              <div className="carriles">
                {sp.hits.map((h) => (
                  <div key={h.label} className="carril">
                    <div className="carril-head">
                      <span className="dot" style={{ background: h.dotColor }} />
                      <span className="mono-lbl">{h.label}</span>
                    </div>
                    {h.items ? (
                      <ul>
                        {h.items.map((it, i) => (
                          <li key={i}><span className="yr">{it.year}</span> · {it.text}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="carril-note">{h.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Proceso */}
        <section className="en-flow sec">
          <p className="eyebrow mag">06 · Proceso</p>
          <h2>Del reparto a la imprenta</h2>
          <div className="proc">
            {PROCESO.map(([n, ttl, body]) => (
              <div key={n} className="proc-step">
                <span className="pn">{n}</span>
                <div>
                  <h3>{ttl}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cierre */}
        <section className="en-flow sec">
          <p className="eyebrow mag">07 · Cierre</p>
          <h2>El libro se imprimió y salió a circular</h2>
          <p className="prose">Se imprimió en diciembre de 2023 en Implementa Boutique Gráfica y se distribuyó por Editorial Cataloma. Lo que quedó de trabajar en editorial colectiva: que un sistema no se defiende con reglas de estilo sino con pocas decisiones estructurales bien elegidas — dónde cae el número, cuántas tintas, qué se puede romper. Con eso, veinte manos distintas siguen haciendo un solo libro. Y que el proyecto existe de verdad recién cuando sale de imprenta.</p>

          <figure className="fig fig-cierre">
            <div className="fig-frame"><img src={creditos} alt="Libro abierto en la portadilla y créditos del taller" /></div>
            <figcaption>Fig. 06 · Portadilla y créditos · Taller Editorial Ilustrado, FAAD UDP</figcaption>
          </figure>
        </section>

        <div className="en-flow en-end">
          <span className="mono-lbl">ENORME · Historia de Bolsillo · Diseño e ilustración · Matías Cáceres · 2023</span>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.en{color:var(--e-ink);
  --e-ink:#0f0f0e;--e-body:#3a3a38;--e-faint:#8a8a85;--e-line:#dcdbd5;--e-line2:#ebeae4;--e-cream:#f2f1ec;
  --e-rose:#ef82bb;--e-rose-lt:#f4a3c8;--e-mag:#5a1836;--e-sky:#a8d4ea;
  --e-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --e-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --e-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;
  --e-max:1180px;}
.en *{box-sizing:border-box;}
.en .en-content{padding:48px 80px 48px 188px;}
@media(max-width:900px){.en .en-content{padding:32px 24px;}}
.en .en-flow{max-width:var(--e-max);}
.en .sec{max-width:var(--e-max);padding:60px 0;border-top:1px solid var(--e-line);margin-top:8px;}
.en .eyebrow{font-family:var(--e-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--e-mag);margin:0 0 16px;display:flex;align-items:center;gap:10px;}
.en .eyebrow::before{content:"";width:22px;height:2px;background:currentColor;}
.en .eyebrow.mag{color:var(--e-mag);}
.en h1{font-family:var(--e-mono);font-weight:400;font-size:clamp(28px,2.6vw,40px);line-height:1.1;margin:0;color:var(--e-ink);}
.en h2{font-family:var(--e-mono-med);font-weight:500;font-size:clamp(23px,3vw,31px);line-height:1.14;letter-spacing:-.01em;margin:0 0 10px;color:var(--e-ink);}
.en h3{font-family:var(--e-mono-med);font-weight:500;font-size:18px;line-height:1.28;margin:0 0 10px;color:var(--e-ink);}
.en .lead{font-family:var(--e-sans);font-size:20px;line-height:1.5;color:var(--e-body);margin:14px 0 6px;}
.en p{font-family:var(--e-sans);font-size:16px;line-height:1.62;color:var(--e-body);margin:0 0 14px;}
.en p:last-child{margin-bottom:0;}
.en .prose{max-width:66ch;}
.en .prose.sm{font-size:14.5px;margin-top:18px;}
.en strong{color:var(--e-ink);font-weight:600;}
.en .mono-lbl{font-family:var(--e-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--e-faint);}
.en .mk{font-family:var(--e-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--e-faint);display:block;margin-bottom:8px;}
.en .mv{font-family:var(--e-sans);font-size:14px;line-height:1.45;color:var(--e-ink);display:block;}
.en .mv em{color:var(--e-faint);font-size:12.5px;font-style:normal;display:block;margin-top:2px;}

/* header */
.en .en-header{padding-bottom:8px;}
.en .meta4{margin-top:28px;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--e-line);border:1px solid var(--e-line);border-radius:1px 4px 4px 1px;overflow:hidden;}
.en .meta4>div{background:#fafaf7;padding:15px 18px;}

/* hero — mundo rosa del libro */
.en .en-hero-sec{margin:40px 0 0;}
.en .en-hero{background:var(--e-rose);border-radius:1px 4px 4px 1px;overflow:hidden;padding:clamp(28px,4vw,64px);}
.en .en-hero-grid{display:grid;grid-template-columns:minmax(0,0.85fr) minmax(0,1.15fr);gap:clamp(20px,3vw,44px);align-items:center;}
.en .en-hero-fig{margin:0;background:#fafaf7;border-radius:2px;overflow:hidden;box-shadow:0 18px 44px rgba(90,24,54,.22);}
.en .en-hero-fig img{display:block;width:100%;height:auto;}
.en .en-hero-cap{margin:clamp(20px,3vw,30px) 0 0;font-family:var(--e-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--e-mag);}

/* trío encargo/desafío/objetivo — vertical, un bloque debajo del otro */
.en .trio{display:grid;grid-template-columns:1fr;gap:0;margin-top:24px;}
.en .trio>div{padding:36px 0;border-top:1px solid var(--e-line);}
.en .trio>div:first-child{padding-top:8px;border-top:none;}
.en .chip-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:22px;}
.en .chip-row .mono-lbl{margin-right:6px;}
.en .chip{padding:6px 12px;border:1px solid var(--e-line);border-radius:1px 4px 4px 1px;background:var(--e-cream);font-family:var(--e-mono-med);font-weight:500;font-size:12px;color:var(--e-ink);}
.en .obj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px;}
.en .obj-card{background:var(--e-cream);border:1px solid var(--e-line);border-radius:1px 4px 4px 1px;padding:16px 18px;}
.en .obj-card p{font-size:14px;line-height:1.6;margin-top:8px;}

/* sistema — paleta */
.en .palette{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--e-line);border:1px solid var(--e-line);border-radius:1px 4px 4px 1px;overflow:hidden;margin:26px 0 26px;}
.en .sw{background:#fafaf7;display:flex;flex-direction:column;}
.en .chip-big{height:100px;}
.en .sw-meta{padding:12px 14px;border-top:1px solid var(--e-line);}
.en .sw-name{display:block;font-family:var(--e-mono-med);font-weight:500;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--e-ink);}
.en .sw-hex{display:block;font-family:var(--e-mono);font-size:10.5px;color:var(--e-faint);margin-top:4px;}

/* sistema — espécimen + anatomía */
.en .sys-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:1px;background:var(--e-line);border:1px solid var(--e-line);border-radius:1px 4px 4px 1px;overflow:hidden;}
.en .sys-card{background:#fafaf7;padding:clamp(20px,3vw,34px);}
.en .sys-card.gray{background:var(--e-cream);}
.en .specimen{margin:18px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-stretch:condensed;font-weight:700;letter-spacing:-.02em;line-height:.88;}
.en .sp-big{font-size:clamp(46px,7vw,86px);}
.en .sp-md{font-size:clamp(28px,4vw,50px);margin-top:4px;}
.en .anat{display:flex;align-items:baseline;gap:12px;margin:18px 0 16px;}
.en .anat-num{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700;font-size:40px;line-height:1;color:var(--e-rose);}
.en .anat-body{font-family:var(--e-sans);font-size:15px;line-height:1.25;color:var(--e-ink);}
.en .anat-verb{display:block;font-family:var(--e-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--e-faint);margin-bottom:4px;}
.en .anat-loc{display:block;font-size:12px;color:var(--e-body);margin-top:2px;}
.en .anat-list{margin:0;padding:0;list-style:none;display:grid;gap:7px;font-family:var(--e-mono);font-size:11px;color:var(--e-body);}

/* spreads */
.en .spread{padding-top:clamp(28px,4vw,44px);border-top:1px solid var(--e-line);margin-top:clamp(28px,4vw,44px);}
.en .spread:first-of-type{border-top:none;padding-top:24px;margin-top:24px;}
.en .spread-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px;}
.en .spread-head h3{font-family:var(--e-mono);font-weight:400;font-size:clamp(22px,2.4vw,32px);line-height:1.1;margin:0;color:var(--e-ink);}
.en .fig{margin:20px 0 0;}
.en .fig-frame{border:1px solid var(--e-line);border-width:1px 4px 4px 1px;border-color:#3a3a38;border-radius:1px 4px 4px 1px;overflow:hidden;background:var(--e-cream);}
.en .fig-frame img{display:block;width:100%;height:auto;}
.en .fig figcaption{font-family:var(--e-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--e-faint);margin-top:10px;}
.en .spread-two{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:20px;margin-top:20px;align-items:start;}
.en .spread-two .fig{margin:0;}
.en .carriles{margin-top:22px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--e-line2);border:1px solid var(--e-line2);border-radius:1px 4px 4px 1px;overflow:hidden;}
.en .carril{background:#fafaf7;padding:18px;}
.en .carril-head{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.en .carril-head .dot{width:8px;height:8px;flex:none;}
.en .carril ul{margin:0;padding:0;list-style:none;display:grid;gap:10px;font-family:var(--e-mono);font-size:12px;line-height:1.5;color:var(--e-body);}
.en .carril .yr{color:var(--e-rose);font-weight:500;}
.en .carril-note{font-family:var(--e-mono);font-size:12px;color:var(--e-faint);margin:0;}

/* proceso */
.en .proc{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px;}
.en .proc-step{display:grid;grid-template-columns:36px 1fr;gap:12px;align-items:start;border:1px solid var(--e-line);border-radius:1px 4px 4px 1px;padding:20px 20px;background:#fafaf7;}
.en .proc-step .pn{font-family:var(--e-mono-med);font-weight:500;font-size:20px;color:var(--e-mag);}
.en .proc-step h3{margin:0 0 6px;font-size:15px;}
.en .proc-step p{font-size:14px;line-height:1.6;margin:0;color:var(--e-body);}

/* cierre */
.en .fig-cierre{margin-top:28px;}

.en .en-end{margin-top:52px;padding-top:24px;border-top:1px solid var(--e-line);}

@media(max-width:1040px){
  .en .palette{grid-template-columns:repeat(3,1fr);}
  .en .sys-grid{grid-template-columns:1fr;}
  .en .carriles{grid-template-columns:1fr;}
  .en .meta4{grid-template-columns:repeat(2,1fr);}
  .en .spread-two{grid-template-columns:1fr;}
  .en .en-hero-grid{grid-template-columns:1fr;}
  .en .obj-grid{grid-template-columns:1fr;}
}
`;
