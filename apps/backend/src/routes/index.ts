import { Router } from 'express';
import authRoutes from './auth.routes';
import llmRoutes from './llm.routes';
import apiRoutes from './api.routes';
import otpRoutes from './otp.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/llm', llmRoutes);
router.use('/v1/api', apiRoutes);
router.use('/v1/otp', otpRoutes);
router.use('/v1/payment', paymentRoutes);

export default router;

