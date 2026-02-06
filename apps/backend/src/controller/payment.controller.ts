import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Create checkout session
export async function createCheckout(req: any, res: Response) {
    try {
        const { planType } = req.body;
        const userId = req.userid; // From auth middleware

        if (!planType || !['pro', 'ultra'].includes(planType)) {
            return res.status(400).json({ error: 'Invalid plan type. Use "pro" or "ultra"' });
        }

        const checkout = await paymentService.createCheckoutSession(userId, planType);

        res.json({
            success: true,
            checkoutUrl: checkout.checkoutUrl,
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout' });
    }
}

// Webhook handler (keeps it simple for MVP)
export async function handleWebhook(req: Request, res: Response) {
    try {
        const event = req.body;

        console.log('🔔 Webhook received:', {
            type: event.type,
            id: event.id,
            timestamp: new Date().toISOString()
        });

        // Log the event for debugging
        await pool.query(
            `INSERT INTO "Payment_Events" (id, event_type, event_data, dodo_event_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (dodo_event_id) DO NOTHING`,
            [uuidv4(), event.type, JSON.stringify(event), event.id]
        );

        console.log(' Event saved to database');

        // Handle different event types
        switch (event.type) {
            case 'payment.succeeded':
            case 'checkout.completed':
                console.log('Processing payment/checkout event');
                await paymentService.handlePaymentSuccess(event.data);
                break;

            case 'subscription.cancelled':
                // Handle cancellation if needed
                console.log('Subscription cancelled:', event.data);
                break;

            default:
                console.log('Unhandled event type:', event.type);
        }

        // Always respond 200 to acknowledge receipt
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
        // Still return 200 to prevent Dodo from retrying
        res.json({ received: true, error: 'Processing failed' });
    }
}

// Get subscription status
export async function getSubscription(req: any, res: Response) {
    try {
        const userId = req.userid;
        const subscription = await paymentService.getSubscriptionStatus(userId);

        res.json(subscription);
    } catch (error: any) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: error.message || 'Failed to get subscription' });
    }
}

// Cancel subscription
export async function cancelSubscription(req: any, res: Response) {
    try {
        const userId = req.userid;
        const result = await paymentService.cancelSubscription(userId);

        res.json(result);
    } catch (error: any) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
    }
}

// Get usage stats
export async function getUsage(req: any, res: Response) {
    try {
        const userId = req.userid;

        const result = await pool.query(
            `SELECT 
         endpoint,
         COUNT(*) as count,
         MAX(created_at) as last_used
       FROM "API_Usage"
       WHERE user_id = $1
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY endpoint
       ORDER BY count DESC`,
            [userId]
        );

        res.json({
            usage: result.rows,
            period: 'current_month',
        });
    } catch (error) {
        console.error('Get usage error:', error);
        res.status(500).json({ error: 'Failed to get usage' });
    }
}
