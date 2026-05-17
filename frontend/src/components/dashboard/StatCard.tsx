import clsx from 'clsx';

export type AccentColor = 'indigo' | 'sky' | 'amber' | 'emerald' | 'red' | 'purple' | 'cyan' | 'slate';

export interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: AccentColor;
  subtitle?: string;
}

const accentIconColors: Record<AccentColor, string> = {
  indigo:  'text-indigo-400',
  sky:     'text-sky-400',
  amber:   'text-amber-400',
  emerald: 'text-emerald-400',
  red:     'text-red-400',
  purple:  'text-purple-400',
  cyan:    'text-cyan-400',
  slate:   'text-slate-400',
};

const accentBgColors: Record<AccentColor, string> = {
  indigo:  'bg-indigo-500/10',
  sky:     'bg-sky-500/10',
  amber:   'bg-amber-500/10',
  emerald: 'bg-emerald-500/10',
  red:     'bg-red-500/10',
  purple:  'bg-purple-500/10',
  cyan:    'bg-cyan-500/10',
  slate:   'bg-slate-500/10',
};

export const StatCard = ({ label, value, icon, accent, subtitle }: StatCardProps) => (
  <div className="stat-card hover-pop p-5 flex items-center gap-4 cursor-default" data-accent={accent}>
    <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', accentBgColors[accent])}>
      <span className={clsx('w-5 h-5', accentIconColors[accent])}>{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
      {subtitle && <p className="text-[10px] text-slate-600 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);
