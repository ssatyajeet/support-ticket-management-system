import { apiGet, apiPatch, apiPost } from './client';
import type {
  ChangeStatusInput,
  CreateTicketInput,
  ListTicketsFilters,
  TicketDetail,
  TicketSummary,
  UpdateTicketInput,
} from '../types/ticket';

function buildListQuery(filters?: ListTicketsFilters): string {
  if (!filters) {
    return '';
  }

  const params = new URLSearchParams();

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.status) {
    params.set('status', filters.status);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function listTickets(
  filters?: ListTicketsFilters,
  signal?: AbortSignal,
): Promise<TicketSummary[]> {
  return apiGet<TicketSummary[]>(`/tickets${buildListQuery(filters)}`, signal);
}

export function getTicket(id: number, signal?: AbortSignal): Promise<TicketDetail> {
  return apiGet<TicketDetail>(`/tickets/${id}`, signal);
}

export function createTicket(
  input: CreateTicketInput,
  signal?: AbortSignal,
): Promise<TicketDetail> {
  return apiPost<TicketDetail>('/tickets', input, signal);
}

export function updateTicket(
  id: number,
  input: UpdateTicketInput,
  signal?: AbortSignal,
): Promise<TicketDetail> {
  return apiPatch<TicketDetail>(`/tickets/${id}`, input, signal);
}

export function changeTicketStatus(
  id: number,
  input: ChangeStatusInput,
  signal?: AbortSignal,
): Promise<TicketDetail> {
  return apiPatch<TicketDetail>(`/tickets/${id}/status`, input, signal);
}
