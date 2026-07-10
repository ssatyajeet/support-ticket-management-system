import { Router } from 'express';
import { addComment } from '../controllers/commentController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router({ mergeParams: true });

router.post('/', asyncHandler(addComment));

export default router;
