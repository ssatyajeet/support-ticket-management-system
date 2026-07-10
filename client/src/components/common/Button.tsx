import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

type ButtonProps = {
  to?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

const variantStyles = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

export default function Button({
  to,
  children,
  variant = 'primary',
  className,
}: ButtonProps) {
  const styles = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    variantStyles[variant],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  return <button type="button" className={styles}>{children}</button>;
}
