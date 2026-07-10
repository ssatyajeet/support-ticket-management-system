import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import { IconFilter } from '../components/icons';
import SearchBar from '../components/tickets/SearchBar';
import StatusFilter from '../components/tickets/StatusFilter';
import StatusTabs from '../components/tickets/StatusTabs';
import TicketList from '../components/tickets/TicketList';
import TicketTable from '../components/tickets/TicketTable';
import { useTicketCounts } from '../hooks/useDashboard';
import { useTickets } from '../hooks/useTickets';
import { STATUSES, type Status } from '../types/enums';
import type { ListTicketsFilters } from '../types/ticket';

const SEARCH_DEBOUNCE_MS = 300;

function parseStatusParam(value: string | null): Status | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const trimmed = value.trim();

  if ((STATUSES as readonly string[]).includes(trimmed)) {
    return trimmed as Status;
  }

  return trimmed as Status;
}

function buildFilters(searchParams: URLSearchParams): ListTicketsFilters {
  const search = searchParams.get('search')?.trim() || undefined;
  const status = parseStatusParam(searchParams.get('status'));

  const filters: ListTicketsFilters = {};

  if (search) {
    filters.search = search;
  }

  if (status) {
    filters.status = status;
  }

  return filters;
}

export default function TicketListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('search') ?? '',
  );
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filters = useMemo(() => buildFilters(searchParams), [searchParams]);
  const { tickets, loading, error } = useTickets(filters);
  const { counts } = useTicketCounts();

  const statusValue = searchParams.get('status') ?? '';
  const statusFilterValue = (STATUSES as readonly string[]).includes(statusValue)
    ? (statusValue as Status)
    : '';

  useEffect(() => {
    setSearchInput(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = searchInput.trim();
      const current = searchParams.get('search') ?? '';

      if (trimmed === current) {
        return;
      }

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (trimmed) {
            next.set('search', trimmed);
          } else {
            next.delete('search');
          }

          return next;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  function handleStatusChange(nextStatus: Status | '') {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (nextStatus) {
          next.set('status', nextStatus);
        } else {
          next.delete('status');
        }

        return next;
      },
      { replace: true },
    );
  }

  const hasActiveFilters = Boolean(filters.search || filters.status);
  const showEmpty = !loading && !error && tickets.length === 0;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Tickets"
        description="Search, filter, and manage all support requests."
        action={<Button to="/tickets/new">+ Create Ticket</Button>}
      />

      <StatusTabs
        activeStatus={statusFilterValue}
        counts={counts}
        onChange={handleStatusChange}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <IconFilter className="h-4 w-4" />
            <span>Filters</span>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={
                viewMode === 'table'
                  ? 'rounded-md bg-white px-3 py-1.5 text-brand-700 shadow-sm'
                  : 'px-3 py-1.5 text-slate-600'
              }
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={
                viewMode === 'cards'
                  ? 'rounded-md bg-white px-3 py-1.5 text-brand-700 shadow-sm'
                  : 'px-3 py-1.5 text-slate-600'
              }
            >
              Cards
            </button>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-100 p-4 sm:grid-cols-2">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <StatusFilter value={statusFilterValue} onChange={handleStatusChange} />
        </div>

        {error ? (
          <div className="p-4">
            <ErrorAlert message={error} />
          </div>
        ) : null}

        {viewMode === 'table' ? (
          <>
            <TicketTable tickets={tickets} loading={loading} />
            {showEmpty ? (
              <div className="p-4">
                <TicketList
                  tickets={tickets}
                  loading={false}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            ) : null}
          </>
        ) : (
          <div className="p-4">
            <TicketList
              tickets={tickets}
              loading={loading}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}
      </div>
    </section>
  );
}
