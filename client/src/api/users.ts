import { apiGet } from './client';
import type { User } from '../types/user';

export function listUsers(signal?: AbortSignal): Promise<User[]> {
  return apiGet<User[]>('/users', signal);
}
