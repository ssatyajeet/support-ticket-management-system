import type { ErrorCode } from './enums';

export type ApiErrorDetail = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  error: {
    message: string;
    code: ErrorCode;
    details?: ApiErrorDetail[];
  };
};
