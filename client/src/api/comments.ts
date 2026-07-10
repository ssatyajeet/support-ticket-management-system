import { apiPost } from './client';
import type { Comment, CreateCommentInput } from '../types/comment';

export function createComment(
  ticketId: number,
  input: CreateCommentInput,
  signal?: AbortSignal,
): Promise<Comment> {
  return apiPost<Comment>(`/tickets/${ticketId}/comments`, input, signal);
}
