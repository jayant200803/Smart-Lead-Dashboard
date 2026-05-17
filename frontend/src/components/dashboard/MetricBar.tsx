import clsx from 'clsx';

export interface MetricBarProps {
  label: string;
  value: number;
  total: number;
  /** Tailwind gradient classes, e.g. "from-purple-600 to-pink-500" */
  gradient: string;
  /** Tailwind text colour class for the value number */
  textColor: string;
}

export const MetricBar = ({ label, value, total, gradient, textColor }: MetricBarProps) => {
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-20 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-700', gradient)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={clsx('text-xs font-semibold tabular-nums w-8 text-right', textColor)}>
        {value}
      </span>
    </div>
  );
};
