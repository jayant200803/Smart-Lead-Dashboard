import clsx from 'clsx';

export interface RingCardProps {
  label: string;
  count: number;
  pct: number;
  /** Hex or CSS colour for the SVG arc stroke */
  stroke: string;
  /** Tailwind classes for the percentage badge background + border */
  badgeBg: string;
  /** Tailwind class for the percentage badge text colour */
  badgeText: string;
}

/** SVG circle circumference for r=15 */
const CIRCUMFERENCE = 2 * Math.PI * 15;

export const RingCard = ({ label, count, pct, stroke, badgeBg, badgeText }: RingCardProps) => {
  const dash = (pct / 100) * CIRCUMFERENCE;

  return (
    <div className="glass-card hover-pop p-4 flex flex-col items-center text-center cursor-default">
      {/* Percentage badge */}
      <div className="self-end mb-1">
        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full border', badgeText, badgeBg)}>
          {pct.toFixed(0)}%
        </span>
      </div>

      {/* SVG donut ring */}
      <div className="relative w-[72px] h-[72px] mb-2.5">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          {/* Filled arc */}
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
          />
        </svg>
        {/* Count label in centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white tabular-nums">{count}</span>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-400 tracking-wide">{label}</p>
    </div>
  );
};
