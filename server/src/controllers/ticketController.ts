import { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import * as ticketService from '../services/ticketService';
import { parseCreateTicketInput, parseChangeStatusInput, parseUpdateTicketInput } from '../validators/ticketValidators';

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

export async function listTickets(_req: Request, res: Response): Promise<void> {
  const tickets = await ticketService.list();
  res.status(200).json(tickets);
}

export async function createTicket(req: Request, res: Response): Promise<void> {
  const input = parseCreateTicketInput(req.body);
  const ticket = await ticketService.create(input);
  res.status(201).json(ticket);
}

export async function getTicket(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = parseTicketId(Array.isArray(rawId) ? rawId[0] : rawId);
  const ticket = await ticketService.getById(id);
  res.status(200).json(ticket);
}

export async function updateTicket(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = parseTicketId(Array.isArray(rawId) ? rawId[0] : rawId);
  const input = parseUpdateTicketInput(req.body);
  const ticket = await ticketService.update(id, input);
  res.status(200).json(ticket);
}

export async function changeTicketStatus(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = parseTicketId(Array.isArray(rawId) ? rawId[0] : rawId);
  const nextStatus = parseChangeStatusInput(req.body);
  const ticket = await ticketService.changeStatus(id, nextStatus);
  res.status(200).json(ticket);
}
