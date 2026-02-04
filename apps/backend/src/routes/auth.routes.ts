import { Router } from 'express';
import { register, login, whoami,updatePassword } from '../controller/auth.controller';
import {auth_middleware} from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/whoami', auth_middleware, whoami);
router.post('/update-password',auth_middleware,updatePassword);

export default router;

