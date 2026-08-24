const NUM_LINES = 25;
const BAR_LENGTH = 480;
const CURSOR_SIZE = 40;
const TRAVEL = BAR_LENGTH - CURSOR_SIZE;

type ProgressBarProps = {
  progress: number;             // 0–1, drives cursor position continuously
  onSeek?: (ratio: number) => void;
  vertical?: boolean;
};

export default function ProgressBar({ progress, onSeek, vertical = false }: ProgressBarProps) {
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const cursorOffset = safeProgress * TRAVEL;

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let raw: number;
    if (vertical) {
      // SVG is rotated -90deg so bottom→top maps to left→right in SVG space
      raw = 1 - (e.clientY - rect.top) / rect.height;
    } else {
      raw = (e.clientX - rect.left) / rect.width;
    }
    onSeek(Math.max(0, Math.min(1, raw)));
  }

  const bar = (
    <svg
      width={BAR_LENGTH + 1}
      height={28}
      viewBox={`0 0 ${BAR_LENGTH + 1} 28`}
      fill="none"
      className="block"
      onClick={handleClick}
      style={{ cursor: onSeek ? 'pointer' : 'default' }}
    >
      {Array.from({ length: NUM_LINES }, (_, i) => {
        const x = (i / (NUM_LINES - 1)) * BAR_LENGTH;
        return (
          <line
            key={i}
            x1={x + 0.5}
            x2={x + 0.5}
            y1="0"
            y2="28"
            stroke="#8A8A85"
          />
        );
      })}
      <g style={{ transform: `translateX(${cursorOffset}px)`, transition: 'transform 0.08s linear' }}>
        <rect
          fill="#FAFAF7"
          height="27"
          stroke="#8A8A85"
          width={CURSOR_SIZE}
          x="0"
          y="0.5"
        />
      </g>
    </svg>
  );

  if (vertical) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: 28, height: BAR_LENGTH }}
      >
        <div className="rotate-90 flex-none" style={{ width: BAR_LENGTH, height: 28 }}>
          {bar}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: BAR_LENGTH + 1, height: 28 }}>
      {bar}
    </div>
  );
}
