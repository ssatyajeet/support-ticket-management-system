import { z } from 'zod';
import { Status } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';

const PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Critical'] as const;

const trimmedRequiredString = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'Required')
    .max(max, `Must be at most ${max} characters`);

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'Required')
    .max(max, `Must be at most ${max} characters`)
    .optional();

const prioritySchema = z.enum(PRIORITY_VALUES, {
  error: 'Priority must be Low, Medium, High, or Critical',
});

const userIdSchema = z
  .number({ error: 'Must be a positive integer' })
  .int()
  .positive();

const optionalUserIdSchema = userIdSchema.nullable().optional();

export const createTicketSchema = z.object({
  title: trimmedRequiredString(200),
  description: trimmedRequiredString(5000),
  priority: prioritySchema,
  createdBy: userIdSchema,
  assignedTo: optionalUserIdSchema,
});

export const updateTicketSchema = z
  .object({
    title: optionalTrimmedString(200),
    description: optionalTrimmedString(5000),
    priority: prioritySchema.optional(),
    assignedTo: userIdSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined ||
      data.assignedTo !== undefined,
    { message: 'At least one field is required' },
  );

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

const API_STATUS_VALUES = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
  'Cancelled',
] as const;

const API_TO_PRISMA_STATUS: Record<(typeof API_STATUS_VALUES)[number], Status> = {
  Open: Status.Open,
  'In Progress': Status.InProgress,
  Resolved: Status.Resolved,
  Closed: Status.Closed,
  Cancelled: Status.Cancelled,
};

export const changeStatusSchema = z.object({
  status: z.enum(API_STATUS_VALUES, {
    error:
      'Status must be Open, In Progress, Resolved, Closed, or Cancelled',
  }),
});

export function parseChangeStatusInput(body: unknown): Status {
  const parsed = changeStatusSchema.parse(body);
  return API_TO_PRISMA_STATUS[parsed.status];
}

function assertNoStatusField(body: unknown): void {
  if (
    body !== null &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    'status' in body
  ) {
    throw new AppError(
      400,
      'STATUS_NOT_ALLOWED_HERE',
      'Status cannot be updated on this endpoint. Use PATCH /api/tickets/:id/status instead.',
    );
  }
}

export function parseCreateTicketInput(body: unknown): CreateTicketInput {
  return createTicketSchema.parse(body);
}

export function parseUpdateTicketInput(body: unknown): UpdateTicketInput {
  assertNoStatusField(body);
  return updateTicketSchema.parse(body);
}

export type ListTicketsFilters = {
  search?: string;
  status?: Status;
};

function parseOptionalSearchParam(raw: unknown): string | undefined {
  if (raw === undefined || raw === null || raw === '') {
    return undefined;
  }

  const value = Array.isArray(raw) ? String(raw[0] ?? '') : String(raw);
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function parseOptionalStatusParam(raw: unknown): Status | undefined {
  if (raw === undefined || raw === null || raw === '') {
    return undefined;
  }

  const value = Array.isArray(raw) ? String(raw[0] ?? '') : String(raw);
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  if (!(trimmed in API_TO_PRISMA_STATUS)) {
    throw new AppError(400, 'INVALID_FILTER', 'Invalid status filter value');
  }

  return API_TO_PRISMA_STATUS[trimmed as keyof typeof API_TO_PRISMA_STATUS];
}

export function parseListTicketsQuery(query: unknown): ListTicketsFilters {
  if (query === null || typeof query !== 'object' || Array.isArray(query)) {
    return {};
  }

  const record = query as Record<string, unknown>;
  const search = parseOptionalSearchParam(record.search);
  const status = parseOptionalStatusParam(record.status);
  const filters: ListTicketsFilters = {};

  if (search !== undefined) {
    filters.search = search;
  }

  if (status !== undefined) {
    filters.status = status;
  }

  return filters;
}
