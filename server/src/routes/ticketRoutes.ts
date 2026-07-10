import { Router } from 'express';
import {
  changeTicketStatus,
  createTicket,
  getTicket,
  listTickets,
  updateTicket,
} from '../controllers/ticketController';
import { asyncHandler } from '../middleware/asyncHandler';
import commentRoutes from './commentRoutes';

const router = Router();

router.get('/', asyncHandler(listTickets));
router.post('/', asyncHandler(createTicket));
router.use('/:id/comments', commentRoutes);
router.get('/:id', asyncHandler(getTicket));
router.patch('/:id/status', asyncHandler(changeTicketStatus));
router.patch('/:id', asyncHandler(updateTicket));

export default router;
