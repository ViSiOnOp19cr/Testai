import { Router } from 'express';
import * as paymentController from '../controller/payment.controller';
import { auth_middleware } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes (need authentication)
router.post('/checkout', auth_middleware, paymentController.createCheckout);
router.get('/subscription', auth_middleware, paymentController.getSubscription);
router.post('/cancel', auth_middleware, paymentController.cancelSubscription);
router.get('/usage', auth_middleware, paymentController.getUsage);

// Public webhook route (NO auth - Dodo calls this)
router.post('/webhook', paymentController.handleWebhook);

export default router;
