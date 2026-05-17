import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-glow-indigo hover:shadow-glow-indigo-lg focus:ring-indigo-500/50',
  secondary: 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.10] text-slate-200 focus:ring-indigo-500/30',
  danger:    'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 focus:ring-red-500/30',
  ghost:     'hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 focus:ring-indigo-500/20',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(base, variants[variant], sizes[size], className)}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
    {children}
    {!isLoading && rightIcon}
  </button>
);
