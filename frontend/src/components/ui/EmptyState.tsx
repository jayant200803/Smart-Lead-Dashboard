export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && (
      <div className="w-14 h-14 bg-white/[0.05] border border-white/[0.08] rounded-full flex items-center justify-center mb-4 text-indigo-400 shadow-glow-sm">
        {icon}
      </div>
    )}
    <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
    {description && (
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
    )}
    {action}
  </div>
);
