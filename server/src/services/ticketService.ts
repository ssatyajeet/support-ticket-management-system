import { Priority, Prisma, Status } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { CreateTicketInput, UpdateTicketInput } from '../validators/ticketValidators';
import { validateTransition } from './statusTransition';

export const ticketWithUsersInclude = {
  createdBy: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true } },
} satisfies Prisma.TicketInclude;

export const ticketWithUsersAndCommentsInclude = {
  ...ticketWithUsersInclude,
  comments: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      createdBy: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.TicketInclude;

export type TicketWithUsers = Prisma.TicketGetPayload<{
  include: typeof ticketWithUsersInclude;
}>;

export type TicketWithUsersAndComments = Prisma.TicketGetPayload<{
  include: typeof ticketWithUsersAndCommentsInclude;
}>;

export type TicketSummaryDto = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: string;
  assignedTo: number | null;
  assignedToName: string | null;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentDto = {
  id: number;
  ticketId: number;
  message: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
};

export type TicketDetailDto = TicketSummaryDto & {
  comments: CommentDto[];
};

const STATUS_DISPLAY: Record<Status, string> = {
  Open: 'Open',
  InProgress: 'In Progress',
  Resolved: 'Resolved',
  Closed: 'Closed',
  Cancelled: 'Cancelled',
};

function toStatusDisplay(status: Status): string {
  return STATUS_DISPLAY[status];
}

function mapTicketBase(ticket: TicketWithUsers): TicketSummaryDto {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: toStatusDisplay(ticket.status),
    assignedTo: ticket.assignedToId,
    assignedToName: ticket.assignedTo?.name ?? null,
    createdBy: ticket.createdById,
    createdByName: ticket.createdBy.name,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

function mapComment(comment: TicketWithUsersAndComments['comments'][number]): CommentDto {
  return {
    id: comment.id,
    ticketId: comment.ticketId,
    message: comment.message,
    createdBy: comment.createdById,
    createdByName: comment.createdBy.name,
    createdAt: comment.createdAt.toISOString(),
  };
}

export function toDto(ticket: TicketWithUsers): TicketSummaryDto;
export function toDto(ticket: TicketWithUsersAndComments): TicketDetailDto;
export function toDto(
  ticket: TicketWithUsers | TicketWithUsersAndComments,
): TicketSummaryDto | TicketDetailDto {
  if ('comments' in ticket) {
    return toDetailDto(ticket);
  }

  return mapTicketBase(ticket);
}

function toDetailDto(ticket: TicketWithUsersAndComments): TicketDetailDto {
  return {
    ...mapTicketBase(ticket),
    comments: ticket.comments.map(mapComment),
  };
}

async function assertUserExists(userId: number, label: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', `${label} with id ${userId} not found`);
  }
}

export async function create(data: CreateTicketInput): Promise<TicketSummaryDto> {
  await assertUserExists(data.createdBy, 'User');

  if (data.assignedTo != null) {
    await assertUserExists(data.assignedTo, 'User');
  }

  const ticket = await prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority as Priority,
      status: Status.Open,
      createdById: data.createdBy,
      assignedToId: data.assignedTo ?? null,
    },
    include: ticketWithUsersInclude,
  });

  return toDto(ticket);
}

export async function list(): Promise<TicketSummaryDto[]> {
  const tickets = await prisma.ticket.findMany({
    include: ticketWithUsersInclude,
    orderBy: { createdAt: 'desc' },
  });

  return tickets.map((ticket) => toDto(ticket));
}

export async function getById(id: number): Promise<TicketDetailDto> {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: ticketWithUsersAndCommentsInclude,
  });

  if (!ticket) {
    throw new AppError(404, 'NOT_FOUND', `Ticket with id ${id} not found`);
  }

  return toDetailDto(ticket);
}

export async function update(
  id: number,
  data: UpdateTicketInput,
): Promise<TicketDetailDto> {
  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', `Ticket with id ${id} not found`);
  }

  if (data.assignedTo != null) {
    await assertUserExists(data.assignedTo, 'User');
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.priority !== undefined
        ? { priority: data.priority as Priority }
        : {}),
      ...(data.assignedTo !== undefined ? { assignedToId: data.assignedTo } : {}),
    },
    include: ticketWithUsersAndCommentsInclude,
  });

  return toDetailDto(ticket);
}

export async function changeStatus(
  id: number,
  nextStatus: Status,
): Promise<TicketDetailDto> {
  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', `Ticket with id ${id} not found`);
  }

  validateTransition(existing.status, nextStatus);

  const ticket = await prisma.ticket.update({
    where: { id },
    data: { status: nextStatus },
    include: ticketWithUsersAndCommentsInclude,
  });

  return toDetailDto(ticket);
}
