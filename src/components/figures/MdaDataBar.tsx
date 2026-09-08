/**
 * MdaDataBar
 * ----------
 * Barra editorial de "Usos del agua" para la etapa 3 del case study
 * "El Mercado del Agua". Reemplaza a la foto genérica de la mesa por un
 * gráfico dibujado en el lenguaje del propio proyecto — dataviz.
 *
 * Datos: 54% Riego, 38% Otros usos, 8% Doméstico. Son porcentajes de
 * VOLUMEN de agua asignado según el catastro agregado DGA (no cantidad de
 * registros — el CSV territorial del proyecto arroja otras proporciones
 * cuando se cuentan filas, y esa distinción está explicitada en el texto
 * de la etapa).
 *
 * Paleta: escala de verdes coherente con la lámina original de 2023 y
 * con el fondo editorial del portafolio (#f2f1ec del FigureImage).
 */

const DATA = [
  { label: 'Doméstico', pct: 8, color: '#a3c1a0' },   // verde claro
  { label: 'Riego', pct: 54, color: '#5f8f5f' },      // verde medio (barra dominante)
  { label: 'Otros', pct: 38, color: '#2f4a2a' },      // verde oscuro
] as const;

const W = 736;
const H = 460;
const LABEL_X = 132;         // fin del bloque de etiquetas (text-anchor: end)
const BAR_X = 148;           // inicio de las barras (16px de aire tras el label)
const BAR_MAX_W = 440;       // Riego (54%) → ~238px de ancho real
const BAR_H = 32;
const GAP = 48;
const START_Y = 132;         // aire arriba para que respire

export default function MdaDataBar() {
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
      role="img"
      aria-label="Distribución del volumen de agua asignado en Petorca: 54% Riego, 38% Otros usos, 8% Doméstico"
    >
      {/* Fondo — mismo tono que la caja FigureImage del ProjectDetail */}
      <rect x={0} y={0} width={W} height={H} fill="#f2f1ec" />

      {/* Eyebrow / título superior */}
      <text
        x={LABEL_X}
        y={72}
        fill="#8a8a85"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="11"
        letterSpacing="1.43"
        textAnchor="end"
      >
        USOS DEL AGUA · VOLUMEN ASIGNADO
      </text>

      {/* Barras + labels + % */}
      {DATA.map((d, i) => {
        const y = START_Y + i * (BAR_H + GAP);
        const barW = (d.pct / 100) * BAR_MAX_W;
        return (
          <g key={d.label}>
            {/* Categoría a la izquierda */}
            <text
              x={LABEL_X}
              y={y + BAR_H * 0.72}
              fill="#0f0f0e"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize="14"
              textAnchor="end"
            >
              {d.label}
            </text>

            {/* Línea base tenue debajo de la barra (recuerda a un eje sin ejes) */}
            <line
              x1={BAR_X}
              x2={BAR_X + BAR_MAX_W}
              y1={y + BAR_H + 1}
              y2={y + BAR_H + 1}
              stroke="#dcdbd5"
              strokeWidth={1}
            />

            {/* Barra */}
            <rect x={BAR_X} y={y} width={barW} height={BAR_H} fill={d.color} />

            {/* % a la derecha de cada barra */}
            <text
              x={BAR_X + barW + 12}
              y={y + BAR_H * 0.72}
              fill="#0f0f0e"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize="14"
            >
              {d.pct}%
            </text>
          </g>
        );
      })}

      {/* Pie: fuente */}
      <text
        x={LABEL_X}
        y={H - 40}
        fill="#8a8a85"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="11"
        letterSpacing="1.43"
        textAnchor="end"
      >
        DERECHOS DE APROVECHAMIENTO · V REGIÓN · 2023
      </text>
    </svg>
  );
}
