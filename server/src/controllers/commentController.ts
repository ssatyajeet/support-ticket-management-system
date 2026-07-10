import { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import * as commentService from '../services/commentService';
import { parseCreateCommentInput } from '../validators/commentValidators';

function parseTicketId(raw: string | undefined): number {
  if (!raw) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid ticket id');
  }

  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid ticket id');
  }

  return id;
}

export async function addComment(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const ticketId = parseTicketId(Array.isArray(rawId) ? rawId[0] : rawId);
  const input = parseCreateCommentInput(req.body);
  const comment = await commentService.create(ticketId, input);
  res.status(201).json(comment);
}
