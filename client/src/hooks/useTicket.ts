import { useCallback, useEffect, useState } from 'react';
import { isApiError } from '../api/client';
import { getTicket } from '../api/tickets';
import type { TicketDetail } from '../types/ticket';

export type UseTicketResult = {
  ticket: TicketDetail | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
};

export function useTicket(id: number | null): UseTicketResult {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    if (id === null) {
      setTicket(null);
      setLoading(false);
      setError('Invalid ticket ID');
      setNotFound(true);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setNotFound(false);

    getTicket(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setTicket(data);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setTicket(null);

        if (isApiError(err)) {
          setError(err.message);

          if (err.statusCode === 404 || err.code === 'NOT_FOUND') {
            setNotFound(true);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load ticket');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, reloadToken]);

  return { ticket, loading, error, notFound, refetch };
}
