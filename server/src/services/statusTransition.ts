import { Status } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const VALID_TRANSITIONS: Record<Status, readonly Status[]> = {
  [Status.Open]: [Status.InProgress, Status.Cancelled],
  [Status.InProgress]: [Status.Resolved, Status.Cancelled],
  [Status.Resolved]: [Status.Closed],
  [Status.Closed]: [],
  [Status.Cancelled]: [],
};

const STATUS_DISPLAY: Record<Status, string> = {
  [Status.Open]: 'Open',
  [Status.InProgress]: 'In Progress',
  [Status.Resolved]: 'Resolved',
  [Status.Closed]: 'Closed',
  [Status.Cancelled]: 'Cancelled',
};

function formatStatus(status: Status): string {
  return STATUS_DISPLAY[status];
}

export function getAllowedTransitions(current: Status): Status[] {
  return [...VALID_TRANSITIONS[current]];
}

export function validateTransition(current: Status, next: Status): void {
  const allowed = VALID_TRANSITIONS[current];

  if (!allowed.includes(next)) {
    const allowedLabel =
      allowed.length === 0
        ? 'none (terminal state)'
        : allowed.map(formatStatus).join(', ');

    throw new AppError(
      400,
      'INVALID_STATUS_TRANSITION',
      `Cannot transition from ${formatStatus(current)} to ${formatStatus(next)}. Allowed transitions: ${allowedLabel}.`,
    );
  }
}
