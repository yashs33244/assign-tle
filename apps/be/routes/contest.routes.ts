import { Router } from 'express';
import { ContestController } from '../controllers/contest.controller';


const router = Router();

// Public routes
router.get('/upcoming', ContestController.getUpcomingContests);
router.get('/past/all', ContestController.getPastContests);

// Protected routes - require authentication
router.post('/bookmark', ContestController.toggleBookmark);
router.get('/bookmarked', ContestController.getBookmarkedContests);

export default router;