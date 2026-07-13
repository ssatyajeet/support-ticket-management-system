import { useEffect, useState } from 'react';
import { isApiError } from '../api/client';
import { listUsers } from '../api/users';
import type { User } from '../types/user';

export type UseUsersResult = {
  users: User[];
  loading: boolean;
  error: string | null;
};

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    listUsers(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setUsers(data);
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
          setError('Failed to load users');
        }

        setUsers([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { users, loading, error };
}
