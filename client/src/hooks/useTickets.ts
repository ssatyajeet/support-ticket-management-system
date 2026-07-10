import { useCallback, useEffect, useState } from 'react';
import { isApiError } from '../api/client';
import { listTickets } from '../api/tickets';
import type { ListTicketsFilters, TicketSummary } from '../types/ticket';

export type UseTicketsResult = {
  tickets: TicketSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useTickets(filters: ListTicketsFilters): UseTicketsResult {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  const search = filters.search;
  const status = filters.status;

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    listTickets({ search, status }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setTickets(data);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (isApiError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong');
        }

        setTickets([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, status, reloadToken]);

  return { tickets, loading, error, refetch };
}
