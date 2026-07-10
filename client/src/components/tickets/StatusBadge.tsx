import clsx from 'clsx';
import type { Status } from '../../types/enums';

const statusStyles: Record<Status, string> = {
  Open: 'border-sky-200/80 bg-sky-50 text-sky-800',
  'In Progress': 'border-amber-200/80 bg-amber-50 text-amber-900',
  Resolved: 'border-emerald-200/80 bg-emerald-50 text-emerald-800',
  Closed: 'border-slate-200/80 bg-slate-100 text-slate-700',
  Cancelled: 'border-rose-200/80 bg-rose-50 text-rose-800',
};

type StatusBadgeProps = {
  status: Status;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
