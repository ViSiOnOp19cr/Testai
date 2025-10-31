import { Router } from 'express';
import { register, login, createApi, whoami } from '../controller/auth.controller';
import { authenticateApiKey } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/createapi', createApi);
router.get('/whoami', authenticateApiKey, whoami);

export default router;

