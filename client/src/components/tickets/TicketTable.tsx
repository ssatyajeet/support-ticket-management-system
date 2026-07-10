import { Link } from 'react-router-dom';
import type { TicketSummary } from '../../types/ticket';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

type TicketTableProps = {
  tickets: TicketSummary[];
  loading: boolean;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TicketTableSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4" aria-busy="true">
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="h-12 rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}

export default function TicketTable({ tickets, loading }: TicketTableProps) {
  if (loading) {
    return <TicketTableSkeleton />;
  }

  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Ticket ID</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Created At</th>
            <th className="px-4 py-3 font-semibold">Assignee</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="transition hover:bg-brand-50/40">
              <td className="px-4 py-3.5 font-medium text-slate-500">#{ticket.id}</td>
              <td className="px-4 py-3.5">
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="font-medium text-slate-900 hover:text-brand-600"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3.5 text-slate-600">{formatDate(ticket.createdAt)}</td>
              <td className="px-4 py-3.5 text-slate-700">
                {ticket.assignedToName ?? (
                  <span className="text-slate-400">Unassigned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
