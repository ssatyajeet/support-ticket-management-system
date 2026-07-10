import clsx from 'clsx';
import type { Priority } from '../../types/enums';

const priorityStyles: Record<Priority, string> = {
  Low: 'border-slate-200/80 bg-slate-50 text-slate-700',
  Medium: 'border-blue-200/80 bg-blue-50 text-blue-800',
  High: 'border-orange-200/80 bg-orange-50 text-orange-800',
  Critical: 'border-red-200/80 bg-red-50 text-red-800',
};

type PriorityBadgeProps = {
  priority: Priority;
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        priorityStyles[priority],
      )}
    >
      {priority}
    </span>
  );
}
