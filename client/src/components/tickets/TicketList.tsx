import { Link } from 'react-router-dom';
import Button from '../common/Button';
import type { TicketSummary } from '../../types/ticket';
import TicketCard from './TicketCard';

type TicketListProps = {
  tickets: TicketSummary[];
  loading: boolean;
  hasActiveFilters: boolean;
};

function TicketListSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-slate-200/80 bg-white/70 p-5"
        >
          <div className="h-4 w-1/4 rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-2/3 rounded-lg bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded-lg bg-slate-100" />
          <div className="mt-2 h-4 w-5/6 rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export default function TicketList({
  tickets,
  loading,
  hasActiveFilters,
}: TicketListProps) {
  if (loading) {
    return <TicketListSkeleton />;
  }

  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300/90 bg-white/60 px-6 py-14 text-center backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-900">No tickets found</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
          {hasActiveFilters
            ? 'Try adjusting your search or status filter to find what you need.'
            : 'Get started by creating your first support ticket.'}
        </p>
        {!hasActiveFilters ? (
          <div className="mt-6">
            <Button to="/tickets/new">Create ticket</Button>
          </div>
        ) : (
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Clear filters
          </Link>
        )}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketCard ticket={ticket} />
        </li>
      ))}
    </ul>
  );
}
