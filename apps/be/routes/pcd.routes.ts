import { Router } from 'express';
import { PCDController } from '../controllers/pcd.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const pcdValidator = [
  body('contestId').notEmpty().withMessage('Contest ID is required'),
  body('youtubeLink')
    .notEmpty().withMessage('YouTube link is required')
    .isURL().withMessage('Invalid YouTube URL')
];

// Public routes
router.get('/contest/:contestId', PCDController.getPCDForContest);
router.get('/contests', PCDController.getPCDForAll);

// Admin routes
router.post('/', pcdValidator, PCDController.addPCDManually);
router.delete('/:pcdId', PCDController.deletePCD);

export default router;