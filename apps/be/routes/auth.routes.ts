import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const registerValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', registerValidator, AuthController.register);
router.post('/login', loginValidator, AuthController.login);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;