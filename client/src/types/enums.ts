export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
  'Cancelled',
] as const;
export type Status = (typeof STATUSES)[number];

export const ROLES = ['Agent', 'Manager', 'Admin'] as const;
export type Role = (typeof ROLES)[number];

export const ERROR_CODES = [
  'VALIDATION_ERROR',
  'INVALID_STATUS_TRANSITION',
  'STATUS_NOT_ALLOWED_HERE',
  'INVALID_FILTER',
  'NOT_FOUND',
  'INTERNAL_ERROR',
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];
