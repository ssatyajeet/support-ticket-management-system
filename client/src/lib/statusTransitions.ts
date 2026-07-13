import type { Status } from '../types/enums';

const VALID_TRANSITIONS: Record<Status, readonly Status[]> = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

export function getAllowedTransitions(current: Status): Status[] {
  return [...VALID_TRANSITIONS[current]];
}

export function isTerminalStatus(status: Status): boolean {
  return VALID_TRANSITIONS[status].length === 0;
}
