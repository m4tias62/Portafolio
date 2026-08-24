import imgImgPresentation1 from "./556ea8de7896ac0e95b5d5e013e9d3d3dd50db21.png";
type FigureImageProps = {
  className?: string;
  width?: "full";
};

function FigureImage({ className, width = "full" }: FigureImageProps) {
  return (
    <div className={className || "relative"}>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <div className="bg-[#f2f1ec] h-[460px] relative shrink-0 w-[736px]" data-name="Frame">
          <div aria-hidden className="absolute border border-[#dcdbd5] border-solid inset-0 pointer-events-none" />
        </div>
        <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#8a8a85] text-[12px] w-[min-content]">Figura 1. Descripción de la imagen. (full)</p>
      </div>
    </div>
  );
}

function Quote({ className }: { className?: string }) {
  return (
    <div className={className || "h-[80px] relative w-[640px]"} data-name="Quote">
      <div aria-hidden className="absolute border-[#0f0f0e] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start pl-[24px] relative size-full">
        <p className="[word-break:break-word] flex-[1_0_0] font-['IBM_Plex_Sans:Italic',sans-serif] font-normal italic leading-[1.6] min-w-px relative text-[#0f0f0e] text-[20px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          Una cita relevante que agrega peso al argumento sin repetir el cuerpo.
        </p>
      </div>
    </div>
  );
}

function Links() {
  return (
    <div className="content-stretch flex gap-[24px] items-start overflow-clip relative shrink-0" data-name="_links">
      <div className="relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3a3a38] text-[14px] whitespace-nowrap">Inicio</p>
          </div>
        </div>
      </div>
      <button className="cursor-pointer relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3a3a38] text-[14px] text-left whitespace-nowrap">Proyectos</p>
          </div>
        </div>
      </button>
      <button className="cursor-pointer relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3a3a38] text-[14px] text-left whitespace-nowrap">Sobre mi</p>
          </div>
        </div>
      </button>
      <button className="cursor-pointer relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3a3a38] text-[14px] text-left whitespace-nowrap">Contacto</p>
          </div>
        </div>
      </button>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-[1279px]">
      <div className="bg-[#fafaf7] h-[56px] relative shrink-0 w-full" data-name="NavBar">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between py-[16px] relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#0f0f0e] text-[14px] whitespace-nowrap">Matías Cáceres - Diseñador</p>
            <Links />
          </div>
        </div>
      </div>
    </div>
  );
}

function OberturaMiuPlaceholder() {
  return (
    <div className="bg-[#fafaf7] flex-[1_0_162px] min-h-px relative w-[1271px]" data-name="Obertura MIU (placeholder)">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['IBM_Plex_Mono:Regular',sans-serif] gap-[32px] items-center justify-center not-italic overflow-clip py-[80px] relative rounded-[inherit] size-full whitespace-nowrap">
        <p className="leading-[normal] relative shrink-0 text-[#0f0f0e] text-[32px]">MI</p>
        <div className="leading-[0] relative shrink-0 text-[#3a3a38] text-[16px] text-center">
          <p className="leading-[normal] mb-0 whitespace-pre">{`MII         MIU`}</p>
          <p className="leading-[normal] mb-0 whitespace-pre">​</p>
          <p className="leading-[normal] mb-0 whitespace-pre">{`MIIII    MIUIU    MIIU`}</p>
          <p className="leading-[normal] mb-0 whitespace-pre">​</p>
          <p className="leading-[normal] whitespace-pre">{`MUIIU  MIIIIII  MIIUIIU  MIIIU`}</p>
        </div>
        <p className="leading-[normal] relative shrink-0 text-[#8a8a85] text-[24px]">MU</p>
        <p className="leading-[1.5] relative shrink-0 text-[#8a8a85] text-[12px]">[Placeholder: sistema MIU generado en p5.js — MU permanece afuera del árbol]</p>
      </div>
      <div aria-hidden className="absolute border border-[#ebeae4] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col h-[686px] items-start p-[8px] relative shrink-0 w-full">
      <OberturaMiuPlaceholder />
    </div>
  );
}

function Hero() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-start left-[80px] top-[56px] w-[1279px]" data-name="Hero">
      <Frame8 />
      <Frame7 />
    </div>
  );
}

function VisualizadorDelRecorridoDeProyectos() {
  return (
    <div className="h-[28px] relative shrink-0 w-[480px]" data-name="visualizador del recorrido de proyectos">
      <div className="absolute inset-[0_-0.21%_0_0]">
        <svg className="block size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 481 28" width="481">
          <g id="visualizador del recorrido de proyectos">
            <line id="Line 1" stroke="#8A8A85" x1="0.5" x2="0.500001" y1="2.18557e-08" y2="28" />
            <line id="Line 2" stroke="#8A8A85" x1="20.5" x2="20.5" y1="2.18557e-08" y2="28" />
            <line id="Line 3" stroke="#8A8A85" x1="40.5" x2="40.5" y1="2.18557e-08" y2="28" />
            <line id="Line 4" stroke="#8A8A85" x1="60.5" x2="60.5" y1="2.18557e-08" y2="28" />
            <line id="Line 5" stroke="#8A8A85" x1="80.5" x2="80.5" y1="2.18557e-08" y2="28" />
            <line id="Line 6" stroke="#8A8A85" x1="100.5" x2="100.5" y1="2.18557e-08" y2="28" />
            <line id="Line 7" stroke="#8A8A85" x1="120.5" x2="120.5" y1="2.18557e-08" y2="28" />
            <line id="Line 8" stroke="#8A8A85" x1="140.5" x2="140.5" y1="2.18557e-08" y2="28" />
            <line id="Line 9" stroke="#8A8A85" x1="160.5" x2="160.5" y1="2.18557e-08" y2="28" />
            <line id="Line 10" stroke="#8A8A85" x1="180.5" x2="180.5" y1="2.18557e-08" y2="28" />
            <line id="Line 11" stroke="#8A8A85" x1="200.5" x2="200.5" y1="2.18557e-08" y2="28" />
            <line id="Line 12" stroke="#8A8A85" x1="220.5" x2="220.5" y1="2.18557e-08" y2="28" />
            <line id="Line 13" stroke="#8A8A85" x1="240.5" x2="240.5" y1="2.18557e-08" y2="28" />
            <line id="Line 14" stroke="#8A8A85" x1="260.5" x2="260.5" y1="2.18557e-08" y2="28" />
            <line id="Line 15" stroke="#8A8A85" x1="280.5" x2="280.5" y1="2.18557e-08" y2="28" />
            <line id="Line 16" stroke="#8A8A85" x1="300.5" x2="300.5" y1="2.18557e-08" y2="28" />
            <line id="Line 17" stroke="#8A8A85" x1="320.5" x2="320.5" y1="2.18557e-08" y2="28" />
            <line id="Line 18" stroke="#8A8A85" x1="340.5" x2="340.5" y1="2.18557e-08" y2="28" />
            <line id="Line 19" stroke="#8A8A85" x1="360.5" x2="360.5" y1="2.18557e-08" y2="28" />
            <line id="Line 20" stroke="#8A8A85" x1="380.5" x2="380.5" y1="2.18557e-08" y2="28" />
            <line id="Line 21" stroke="#8A8A85" x1="400.5" x2="400.5" y1="2.18557e-08" y2="28" />
            <line id="Line 22" stroke="#8A8A85" x1="420.5" x2="420.5" y1="2.18557e-08" y2="28" />
            <line id="Line 23" stroke="#8A8A85" x1="440.5" x2="440.5" y1="2.18557e-08" y2="28" />
            <line id="Line 24" stroke="#8A8A85" x1="460.5" x2="460.5" y1="2.18557e-08" y2="28" />
            <line id="Line 25" stroke="#8A8A85" x1="480.5" x2="480.5" y1="2.18557e-08" y2="28" />
            <rect fill="#FAFAF7" height="27" id="cursor posiciÃ³n" stroke="#8A8A85" width="40" x="33.5" y="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col h-[655px] items-start relative shrink-0 w-[978px]">
      <div className="bg-[#d9d9d9] h-[613px] relative shrink-0 w-full" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col h-[655px] items-start relative shrink-0 w-[978px]">
      <div className="bg-[#d9d9d9] h-[613px] relative shrink-0 w-full" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col h-[655px] items-start relative shrink-0 w-[978px]">
      <div className="bg-[#d9d9d9] h-[613px] relative shrink-0 w-full" />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[96px] items-start overflow-x-auto overflow-y-clip relative shrink-0 w-full">
      <Frame10 />
      <Frame12 />
      <Frame11 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-center overflow-x-auto overflow-y-clip relative shrink-0 w-full">
      <VisualizadorDelRecorridoDeProyectos />
      <Frame13 />
    </div>
  );
}

function Projects() {
  return (
    <div className="absolute border-[#8a8a85] border-b border-solid border-t content-stretch flex flex-col gap-[24px] items-start left-[80px] py-[48px] top-[862px] w-[1359px]" data-name="projects">
      <div className="relative shrink-0 w-full" data-name="SectionHeader">
        <div className="content-stretch flex flex-col gap-[12px] items-start py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.2] relative shrink-0 text-[#0f0f0e] text-[32px] tracking-[-0.32px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
            Proyectos
          </p>
        </div>
      </div>
      <Frame14 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-[689px]">
      <div className="h-[80px] relative shrink-0 w-full" data-name="SectionHeader">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start relative size-full">
          <p className="font-['IBM_Plex_Mono:Medium',sans-serif] leading-[1.47] not-italic relative shrink-0 text-[#8a8a85] text-[11px] tracking-[1.43px] w-full">Sobre mí</p>
          <p className="font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.2] relative shrink-0 text-[#0f0f0e] text-[32px] tracking-[-0.32px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
            Matías Cáceres
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[217px]">
      <div className="aspect-[540/522] pointer-events-none relative shrink-0 w-full" data-name="img presentation 1">
        <img alt="" className="absolute inset-0 max-w-none object-bottom size-full" src={imgImgPresentation1} />
        <div aria-hidden className="absolute border-b-[4.497px] border-black border-l-[2.249px] border-r-[4.497px] border-solid border-t-[2.249px] inset-0" />
      </div>
      <p className="[word-break:break-word] font-['IBM_Plex_Mono:Medium',sans-serif] leading-[1.47] not-italic relative shrink-0 text-[11px] text-black tracking-[1.43px] w-full">Diseñador_Universidad Diego Portales_Santiago de Chile</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <Frame />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[338px]">
      <Quote className="relative shrink-0 w-full" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[79px] items-center relative shrink-0 w-full">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-full">
      <Frame3 />
    </div>
  );
}

function AboutMe() {
  return (
    <div className="absolute border-[#8a8a85] border-b border-solid content-stretch flex flex-col gap-[16px] items-start left-[80px] py-[48px] top-[1769px] w-[1280px]" data-name="About Me">
      <Frame5 />
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-[689px]">
      <div className="relative shrink-0 w-full" data-name="SectionHeader">
        <div className="content-stretch flex flex-col gap-[12px] items-start py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.2] relative shrink-0 text-[#0f0f0e] text-[32px] tracking-[-0.32px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
            Contáctame
          </p>
        </div>
      </div>
    </div>
  );
}

function InputName() {
  return <div className="bg-[#dcdbd5] border-[#3a3a38] border-[0.5px] border-solid h-[41px] relative shrink-0 w-full" data-name="Input name" />;
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[20px] text-black w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        Nombre
      </p>
      <InputName />
    </div>
  );
}

function InputName1() {
  return <div className="bg-[#dcdbd5] border-[#3a3a38] border-[0.5px] border-solid h-[41px] relative shrink-0 w-full" data-name="Input name" />;
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[20px] text-black w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        Correo
      </p>
      <InputName1 />
    </div>
  );
}

function InputName2() {
  return <div className="bg-[#dcdbd5] border-[#3a3a38] border-[0.5px] border-solid h-[171px] relative shrink-0 w-full" data-name="Input name" />;
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[20px] text-black w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        Mensaje
      </p>
      <InputName2 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#f2f1ec] border-[#3a3a38] border-b-4 border-l-2 border-r-4 border-solid border-t-2 content-stretch flex flex-col gap-[16px] items-start p-[16px] relative shrink-0 w-[628px]">
      <Frame15 />
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[628px]">
      <Frame6 />
      <Frame18 />
    </div>
  );
}

function Contactame() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[80px] py-[48px] top-[2371px] w-[1280px]" data-name="Contáctame">
      <Frame19 />
    </div>
  );
}

function Frame20() {
  return <div className="absolute bg-[#1e1e1e] h-[474px] left-0 top-[2997px] w-[1440px]" />;
}

function Home() {
  return (
    <div className="absolute bg-[#fafaf7] h-[3471px] left-[195px] overflow-clip top-[224px] w-[1440px]" data-name="Home">
      <Hero />
      <Projects />
      <AboutMe />
      <Contactame />
      <Frame20 />
    </div>
  );
}

function Estapa() {
  return (
    <div className="content-stretch flex gap-[108px] items-center relative shrink-0 w-full" data-name="estapa 1">
      <FigureImage className="relative shrink-0" />
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.7] relative shrink-0 text-[17px] text-black w-[326px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione `}</p>
    </div>
  );
}

function Etapa() {
  return (
    <div className="content-stretch flex gap-[108px] items-center relative shrink-0 w-full" data-name="etapa 2">
      <FigureImage className="relative shrink-0" />
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.7] relative shrink-0 text-[17px] text-black w-[326px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione `}</p>
    </div>
  );
}

function Etapa1() {
  return (
    <div className="content-stretch flex gap-[108px] items-center relative shrink-0 w-full" data-name="etapa 3">
      <FigureImage className="relative shrink-0" />
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.7] relative shrink-0 text-[17px] text-black w-[326px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione `}</p>
    </div>
  );
}

function EstapasDelProyecto() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[80px] items-start left-[calc(8.33%+70px)] top-[176px] w-[1170px]" data-name="estapas del proyecto">
      <Estapa />
      <Etapa />
      <Etapa1 />
    </div>
  );
}

function Links1() {
  return (
    <div className="content-stretch flex gap-[24px] items-start overflow-clip relative shrink-0" data-name="_links">
      <div className="relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#3a3a38] text-[14px] whitespace-nowrap">Inicio</p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#dcdbd5] text-[14px] whitespace-nowrap">Proyectos</p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#dcdbd5] text-[14px] whitespace-nowrap">Sobre mi</p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0" data-name="buttons">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#dcdbd5] text-[14px] whitespace-nowrap">Contacto</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute bottom-0 h-[1889px] left-[80px] pointer-events-none top-[56px]">
      <div className="content-stretch flex flex-col items-start pointer-events-auto py-[8px] sticky top-0 w-[1280px]">
        <div className="bg-[#fafaf7] h-[56px] relative shrink-0 w-full" data-name="NavBar">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between py-[16px] relative size-full">
              <p className="[word-break:break-word] font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#0f0f0e] text-[14px] whitespace-nowrap">Matías Cáceres - Diseñador</p>
              <Links1 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizadorDelRecorridoDeProyectos1() {
  return (
    <div className="absolute flex h-[486px] items-center justify-center left-[80px] top-[176px] w-[28px]">
      <div className="-rotate-90 flex-none">
        <div className="h-[28px] relative w-[486px]" data-name="visualizador del recorrido de proyectos">
          <div className="absolute inset-[0_-0.21%_0_0]">
            <svg className="block size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 487 28" width="487">
              <g id="visualizador del recorrido de proyectos">
                <line id="Line 1" stroke="#8A8A85" x1="0.5" x2="0.500001" y1="2.18557e-08" y2="28" />
                <line id="Line 2" stroke="#8A8A85" x1="20.75" x2="20.75" y1="1.15862e-06" y2="28" />
                <line id="Line 3" stroke="#8A8A85" x1="41" x2="41" y1="2.03285e-06" y2="28" />
                <line id="Line 4" stroke="#8A8A85" x1="61.25" x2="61.25" y1="2.90708e-06" y2="28" />
                <line id="Line 5" stroke="#8A8A85" x1="81.5" x2="81.5" y1="3.7813e-06" y2="28" />
                <line id="Line 6" stroke="#8A8A85" x1="101.75" x2="101.75" y1="4.65553e-06" y2="28" />
                <line id="Line 7" stroke="#8A8A85" x1="122" x2="122" y1="5.52976e-06" y2="28" />
                <line id="Line 8" stroke="#8A8A85" x1="142.25" x2="142.25" y1="6.40399e-06" y2="28" />
                <line id="Line 9" stroke="#8A8A85" x1="162.5" x2="162.5" y1="7.27822e-06" y2="28" />
                <line id="Line 10" stroke="#8A8A85" x1="182.75" x2="182.75" y1="8.15244e-06" y2="28" />
                <line id="Line 11" stroke="#8A8A85" x1="203" x2="203" y1="9.02667e-06" y2="28" />
                <line id="Line 12" stroke="#8A8A85" x1="223.25" x2="223.25" y1="9.9009e-06" y2="28" />
                <line id="Line 13" stroke="#8A8A85" x1="243.5" x2="243.5" y1="1.07751e-05" y2="28" />
                <line id="Line 14" stroke="#8A8A85" x1="263.75" x2="263.75" y1="1.16494e-05" y2="28" />
                <line id="Line 15" stroke="#8A8A85" x1="284" x2="284" y1="1.25236e-05" y2="28" />
                <line id="Line 16" stroke="#8A8A85" x1="304.25" x2="304.25" y1="1.33978e-05" y2="28" />
                <line id="Line 17" stroke="#8A8A85" x1="324.5" x2="324.5" y1="1.4272e-05" y2="28" />
                <line id="Line 18" stroke="#8A8A85" x1="344.75" x2="344.75" y1="1.51463e-05" y2="28" />
                <line id="Line 19" stroke="#8A8A85" x1="365" x2="365" y1="1.60205e-05" y2="28" />
                <line id="Line 20" stroke="#8A8A85" x1="385.25" x2="385.25" y1="1.68947e-05" y2="28" />
                <line id="Line 21" stroke="#8A8A85" x1="405.5" x2="405.5" y1="1.7769e-05" y2="28" />
                <line id="Line 22" stroke="#8A8A85" x1="425.75" x2="425.75" y1="1.86432e-05" y2="28" />
                <line id="Line 23" stroke="#8A8A85" x1="446" x2="446" y1="1.95174e-05" y2="28" />
                <line id="Line 24" stroke="#8A8A85" x1="466.25" x2="466.25" y1="2.03916e-05" y2="28" />
                <line id="Line 25" stroke="#8A8A85" x1="486.5" x2="486.5" y1="2.12659e-05" y2="28" />
                <rect fill="#FAFAF7" height="27" id="cursor posiciÃ³n" stroke="#8A8A85" width="40.5125" x="33.9125" y="0.500002" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function EspecificProyect() {
  return (
    <div className="absolute bg-[#fafaf7] h-[1945px] left-[2342px] overflow-clip top-[224px] w-[1440px]" data-name="especific Proyect">
      <EstapasDelProyecto />
      <Frame9 />
      <VisualizadorDelRecorridoDeProyectos1 />
    </div>
  );
}

export default function Prototipo() {
  return (
    <div className="bg-[#3a3a38] relative size-full" data-name="Prototipo">
      <Home />
      <EspecificProyect />
    </div>
  );
}