import clsx from 'clsx';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cyan';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:  'bg-red-500/10 text-red-400 border-red-500/20',
  info:    'bg-sky-500/10 text-sky-400 border-sky-500/20',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cyan:    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span className={clsx('badge', variants[variant], className)}>
    {children}
  </span>
);
