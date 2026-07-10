import { Router } from 'express';
import { listUsers } from '../controllers/userController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(listUsers));

export default router;
