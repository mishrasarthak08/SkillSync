import { Router } from 'express';
import { signup, login, getCurrentUser } from './auth.handlers.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
