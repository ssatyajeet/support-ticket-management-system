import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export type ErrorDetail = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  error: {
    message: string;
    code: string;
    details?: ErrorDetail[];
  };
};

function isJsonParseError(err: unknown): err is SyntaxError & { status?: number; type?: string } {
  return (
    err instanceof SyntaxError &&
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    (err as { status?: number }).status === 400 &&
    'type' in err &&
    (err as { type?: string }).type === 'entity.parse.failed'
  );
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: ErrorDetail[],
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    const body: ErrorResponse = {
      error: {
        message: err.message,
        code: err.code,
        ...(err.details ? { details: err.details } : {}),
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (isJsonParseError(err)) {
    const body: ErrorResponse = {
      error: {
        message: 'Invalid JSON in request body',
        code: 'VALIDATION_ERROR',
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ErrorResponse = {
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    };
    res.status(400).json(body);
    return;
  }

  console.error('Unhandled error:', err);

  const body: ErrorResponse = {
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  };
  res.status(500).json(body);
}
