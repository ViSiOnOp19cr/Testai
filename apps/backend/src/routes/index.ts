import { Router } from 'express';
import authRoutes from './auth.routes';
import llmRoutes from './llm.routes';
import apiRoutes from './api.routes';

const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/llm', llmRoutes);
router.use('/v1/api', apiRoutes);

export default router;

