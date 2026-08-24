import { useEffect, useRef, useState } from 'react';
import ProgressBar from '@/components/ProgressBar';

type Stage = {
  id: number;
  label: string;
  text: string;
};

const stages: Stage[] = [
  {
    id: 1,
    label: 'Etapa 1 — Contexto',
    text: 'El proyecto nació de una pregunta sobre los límites de los sistemas formales: ¿puede una serie de reglas simples generar complejidad infinita? El sistema MIU de Douglas Hofstadter sirvió como marco: partiendo de la cadena MI, cuatro reglas de producción generan transformaciones indefinidas.',
  },
  {
    id: 2,
    label: 'Etapa 2 — Investigación',
    text: 'Se investigaron las propiedades matemáticas del sistema: la invariante de Hofstadter, la imposibilidad de alcanzar MU, y la relación entre recursividad y emergencia. Esta fase incluyó revisión de literatura sobre sistemas formales, gramáticas generativas y diseño algorítmico.',
  },
  {
    id: 3,
    label: 'Etapa 3 — Referentes',
    text: 'Se analizaron referentes que cruzan sistemas lógicos con diseño visual: desde los autómatas celulares de Conway hasta los proyectos tipográficos de Metadesign. La pregunta guía fue cómo visualizar una regla sin ilustrarla literalmente.',
  },
  {
    id: 4,
    label: 'Etapa 4 — Prototipado',
    text: 'Los primeros prototipos implementaron las cuatro reglas del sistema MIU en p5.js: Regla I (MI→MII), Regla II (Mx→Mxx), Regla III (xIIIy→xUy) y Regla IV (xUUy→xy). Cada cadena generada se tradujo a una forma visual mediante coordenadas.',
  },
  {
    id: 5,
    label: 'Etapa 5 — Desarrollo tipográfico',
    text: 'A partir del prototipo se construyó un sistema tipográfico generativo donde cada glifo corresponde a una cadena del árbol. La variación de peso, eje y proporciones depende de la longitud y composición de la cadena que lo origina.',
  },
  {
    id: 6,
    label: 'Etapa 6 — Iteración',
    text: 'Se realizaron múltiples ciclos de ajuste: parámetros de mapeo, escala visual, densidad del árbol. Se descartaron ramas del sistema que producían formas ilegibles o visualmente triviales, buscando el equilibrio entre complejidad y coherencia.',
  },
  {
    id: 7,
    label: 'Etapa 7 — Instalación',
    text: 'El trabajo culminó en un entorno interactivo donde el visitante aplica las reglas en tiempo real. La interfaz expone el árbol de derivación: cada nodo es un glifo, cada arista es una regla aplicada. MU aparece siempre fuera del árbol, en el borde de la pantalla.',
  },
  {
    id: 8,
    label: 'Etapa 8 — Documentación',
    text: 'Se documentó el sistema mediante publicación editorial que registra el proceso, las decisiones descartadas y los diagramas de derivación. La publicación funciona como partitura del sistema: permite reproducirlo sin ejecutarlo.',
  },
  {
    id: 9,
    label: 'Etapa 9 — Exhibición',
    text: 'El proyecto se presentó en el Salón de Diseño UDP 2024. La instalación fue recibida con interés por su capacidad de hacer visible un proceso lógico sin reducirlo a una infografía. MU permaneció siempre inalcanzable, fiel a la demostración de Hofstadter.',
  },
  {
    id: 10,
    label: 'Etapa 10 — Conclusiones',
    text: 'El sistema MIU demostró que la restricción generativa puede ser un método de diseño productivo. La imposibilidad de alcanzar MU no es un fracaso del sistema: es su punto más revelador. Un horizonte que ordena sin ser alcanzado es también una descripción posible del diseño.',
  },
];

function FigureImage({ stageId }: { stageId: number }) {
  return (
    <div className="shrink-0">
      <div
        className="bg-[#f2f1ec] relative border border-[#dcdbd5] flex items-center justify-center"
        style={{ width: 736, height: 460 }}
      >
        <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85]">
          Figura {stageId}
        </span>
      </div>
      <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85] leading-[1.5] mt-3">
        Figura {stageId}. Descripción de la imagen.
      </p>
    </div>
  );
}

export default function ProjectDetail() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track page scroll to drive the vertical progress bar
  useEffect(() => {
    function onScroll() {
      const el = contentRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // progress from when top of content hits bottom of viewport to when bottom hits top
      const scrollable = height - viewH;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, -top / scrollable)) : 0;
      setScrollProgress(progress);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Seek: click on vertical bar scrolls the page
  function handleSeek(ratio: number) {
    const el = contentRef.current;
    if (!el) return;
    const { height } = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const scrollable = height - viewH;
    if (scrollable > 0) {
      const targetTop = el.offsetTop + ratio * scrollable;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }

  return (
    <div className="bg-[#fafaf7] min-h-screen relative">
      {/* Vertical progress bar — fixed on left */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical />
      </div>

      {/* Content */}
      <div ref={contentRef} className="pl-[188px] pr-[80px] py-[48px]">
        <div className="mb-[48px]">
          <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase mb-2">
            Proyecto 01
          </p>
          <p
            className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[40px] text-[#0f0f0e] leading-[1.1] tracking-[-0.4px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Sistema MIU
          </p>
        </div>

        <div className="flex flex-col gap-[80px]">
          {stages.map(stage => (
            <div
              key={stage.id}
              id={`stage-${stage.id}`}
              className="flex gap-[108px] items-start"
            >
              <FigureImage stageId={stage.id} />
              <div className="flex flex-col gap-[24px] pt-8" style={{ width: 326 }}>
                <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase">
                  {stage.label}
                </p>
                <p
                  className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-black leading-[1.7]"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  {stage.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
