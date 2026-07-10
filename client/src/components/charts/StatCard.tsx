import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type StatCardProps = {
  label: string;
  value: number | string;
  icon: ReactNode;
  trend?: string;
  accent?: 'brand' | 'sky' | 'amber' | 'emerald' | 'slate' | 'rose';
};

const accentStyles = {
  brand: 'bg-brand-50 text-brand-600',
  sky: 'bg-sky-50 text-sky-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  accent = 'brand',
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {trend ? <p className="mt-1 text-xs text-emerald-600">{trend}</p> : null}
        </div>
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            accentStyles[accent],
          )}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
