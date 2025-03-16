import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// All admin routes require authentication and admin role
// router.use(authenticate, requireAdmin);

// User management
// router.get('/users', AdminController.getAllUsers);
// router.put('/users/role', [
//   body('userId').notEmpty().withMessage('User ID is required'),
//   body('role').isIn(['user', 'admin']).withMessage('Role must be "user" or "admin"')
// ], AdminController.updateUserRole);

// Contest management
router.post('/update-contests', AdminController.triggerContestUpdate);

export default router;