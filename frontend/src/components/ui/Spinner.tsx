import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner = ({ size = 'md' }: SpinnerProps) => (
  <Loader2 className={clsx(sizes[size], 'animate-spin text-indigo-400')} />
);
