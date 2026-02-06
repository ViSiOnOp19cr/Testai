import { Router } from 'express';
import { register, login, whoami, updatePassword, resetPassword } from '../controller/auth.controller';
import { authenticateApiKey } from '../middlewares/llm.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/whoami', authenticateApiKey, whoami);
router.post('/update-password', updatePassword);
router.post('/reset-password', resetPassword);

export default router;

