import { Status } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/middleware/errorHandler';
import {
  getAllowedTransitions,
  validateTransition,
} from '../../src/services/statusTransition';

describe('statusTransition (unit)', () => {
  describe('getAllowedTransitions', () => {
    it('returns In Progress and Cancelled for Open', () => {
      expect(getAllowedTransitions(Status.Open)).toEqual([
        Status.InProgress,
        Status.Cancelled,
      ]);
    });

    it('returns empty array for Closed (terminal)', () => {
      expect(getAllowedTransitions(Status.Closed)).toEqual([]);
    });

    it('returns empty array for Cancelled (terminal)', () => {
      expect(getAllowedTransitions(Status.Cancelled)).toEqual([]);
    });
  });

  describe('validateTransition — valid (AC-17)', () => {
    it.each([
      [Status.Open, Status.InProgress],
      [Status.InProgress, Status.Resolved],
      [Status.Resolved, Status.Closed],
      [Status.Open, Status.Cancelled],
      [Status.InProgress, Status.Cancelled],
    ] as const)('%s → %s does not throw', (current, next) => {
      expect(() => validateTransition(current, next)).not.toThrow();
    });
  });

  describe('validateTransition — invalid (AC-18)', () => {
    it.each([
      [Status.Open, Status.Resolved],
      [Status.Open, Status.Closed],
      [Status.Resolved, Status.Open],
      [Status.Closed, Status.InProgress],
      [Status.Cancelled, Status.InProgress],
      [Status.Cancelled, Status.Closed],
    ] as const)('%s → %s throws INVALID_STATUS_TRANSITION', (current, next) => {
      expect(() => validateTransition(current, next)).toThrow(AppError);
      try {
        validateTransition(current, next);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        const appError = err as AppError;
        expect(appError.statusCode).toBe(400);
        expect(appError.code).toBe('INVALID_STATUS_TRANSITION');
      }
    });
  });

  describe('validateTransition — terminal states', () => {
    it('rejects any transition from Closed', () => {
      expect(() => validateTransition(Status.Closed, Status.Open)).toThrow(
        AppError,
      );
    });

    it('rejects any transition from Cancelled', () => {
      expect(() => validateTransition(Status.Cancelled, Status.Open)).toThrow(
        AppError,
      );
    });
  });
});
