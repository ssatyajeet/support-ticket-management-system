import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { Priority } from '../../types/enums';
import type { TicketSummary } from '../../types/ticket';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const priorityAccent: Record<Priority, string> = {
  Low: 'border-l-slate-400',
  Medium: 'border-l-blue-500',
  High: 'border-l-orange-500',
  Critical: 'border-l-red-500',
};

type TicketCardProps = {
  ticket: TicketSummary;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className={cn(
        'group block rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm',
        'border-l-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60',
        priorityAccent[ticket.priority],
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            #{ticket.id}
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 group-hover:text-brand-700">
            {ticket.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {ticket.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>
          Assignee:{' '}
          <span className="font-medium text-slate-700">
            {ticket.assignedToName ?? 'Unassigned'}
          </span>
        </span>
        <span>Created {formatDate(ticket.createdAt)}</span>
      </div>
    </Link>
  );
}
