import { Router } from 'express';
import authRoutes from './auth.routes';
import llmRoutes from './llm.routes';

const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/llm', llmRoutes);

export default router;

