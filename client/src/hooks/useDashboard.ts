import { useEffect, useMemo, useState } from 'react';
import { listTickets } from '../api/tickets';
import { isApiError } from '../api/client';
import type { Status } from '../types/enums';
import type { TicketSummary } from '../types/ticket';

export type TicketCounts = {
  all: number;
} & Record<Status, number>;

const emptyCounts = (): TicketCounts => ({
  all: 0,
  Open: 0,
  'In Progress': 0,
  Resolved: 0,
  Closed: 0,
  Cancelled: 0,
});

export function useTicketCounts() {
  const [counts, setCounts] = useState<TicketCounts>(emptyCounts());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    listTickets(undefined, controller.signal)
      .then((tickets) => {
        if (controller.signal.aborted) {
          return;
        }

        const next = emptyCounts();
        next.all = tickets.length;

        for (const ticket of tickets) {
          next[ticket.status] += 1;
        }

        setCounts(next);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCounts(emptyCounts());
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { counts, loading };
}

export function useDashboardData() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    listTickets(undefined, controller.signal)
      .then(setTickets)
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (isApiError(err)) {
          setError(err.message);
        } else {
          setError('Failed to load dashboard data');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const counts = emptyCounts();
    counts.all = tickets.length;

    for (const ticket of tickets) {
      counts[ticket.status] += 1;
    }

    return counts;
  }, [tickets]);

  const recentTickets = useMemo(
    () =>
      [...tickets]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [tickets],
  );

  return { tickets, stats, recentTickets, loading, error };
}
