/**
 * BackButton — botón "Volver" con la estética heredada del sistema:
 * borde asimétrico (fino arriba/izquierda, grueso abajo/derecha) sobre
 * #3a3a38, tipografía IBM Plex Mono, fondo blanco que oscurece en hover.
 *
 * Se usa en las vistas de nivel-2 (CategoryPage) y nivel-3 (ProjectDetail)
 * para permitir subir un paso en la jerarquía de navegación.
 */
type BackButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function BackButton({ onClick, label = 'Volver' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-[10px] bg-white px-[20px] py-[12px] hover:bg-[#f2f1ec] transition-colors cursor-pointer"
      style={{
        borderWidth: '1px 4px 4px 1px',
        borderStyle: 'solid',
        borderColor: '#3a3a38',
      }}
    >
      <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[16px] text-[#0f0f0e] leading-none transition-transform group-hover:-translate-x-1">
        ←
      </span>
      <span className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] text-[#0f0f0e] tracking-[1.43px] leading-[1.47] uppercase">
        {label}
      </span>
    </button>
  );
}
