import type { Comment } from './comment';
import type { Priority, Status } from './enums';

export type TicketSummary = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: number | null;
  assignedToName: string | null;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
};

export type TicketDetail = TicketSummary & {
  comments: Comment[];
};

export type ListTicketsFilters = {
  search?: string;
  status?: Status;
};

export type CreateTicketInput = {
  title: string;
  description: string;
  priority: Priority;
  createdBy: number;
  assignedTo?: number | null;
};

export type UpdateTicketInput = {
  title?: string;
  description?: string;
  priority?: Priority;
  assignedTo?: number | null;
};

export type ChangeStatusInput = {
  status: Status;
};
