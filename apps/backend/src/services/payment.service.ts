import { dodoClient, DODO_PRODUCTS } from '../config/dodo.config';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { PLANS } from '../config/plans';

// Create checkout session for a plan
export async function createCheckoutSession(userId: string, planType: 'pro' | 'ultra') {
    try {
        const productId = DODO_PRODUCTS[planType];
        const plan = PLANS[planType];

        if (!productId) {
            throw new Error(`Product ID not configured for plan: ${planType}`);
        }

        // Create checkout with Dodo
        const checkout = await dodoClient.checkoutSessions.create({
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                },
            ],
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            metadata: {
                user_id: userId,
                plan_type: planType,
            },
        });

        return {
            checkoutUrl: checkout.checkout_url || '',
            checkoutId: checkout.session_id,
        };
    } catch (error) {
        console.error('Checkout creation failed:', error);
        throw error;
    }
}

// Handle successful payment
export async function handlePaymentSuccess(paymentData: any) {
    try {
        // Extract the actual payment data
        const actualData = paymentData.data || paymentData;
        const customerId = actualData.customer?.customer_id;
        const subscriptionId = actualData.subscription_id;
        const metadata = actualData.metadata;
        const userId = metadata?.user_id;
        const planType = metadata?.plan_type;

        if (!userId || !planType) {
            console.error('❌ Missing user_id or plan_type in payment metadata:', metadata);
            return;
        }

        const plan = PLANS[planType as keyof typeof PLANS];
        if (!plan) {
            console.error(`❌ Invalid plan type: ${planType}`);
            return;
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        // Update user plan
        const updateResult = await pool.query(
            `UPDATE "User" 
         SET plan = $1, 
             monthly_quota = $2,
             subscription_status = 'active',
             quota_reset_date = $3,
             "updatedAt" = NOW()
         WHERE id = $4
         RETURNING id, email, plan`,
            [planType, plan.monthlyRequests, endDate, userId]
        );

        if (updateResult.rowCount === 0) {
            console.error('⚠️ User not found for payment:', userId);
            return;
        }

        // Create subscription record
        await pool.query(
            `INSERT INTO "Subscriptions" 
         (id, user_id, plan_type, amount, payment_status, dodo_subscription_id, dodo_customer_id, start_date, end_date)
         VALUES ($1, $2, $3, $4, 'succeeded', $5, $6, $7, $8)`,
            [uuidv4(), userId, planType, plan.price, subscriptionId, customerId, startDate, endDate]
        );

        console.log(`✅ Payment processed: User ${updateResult.rows[0].email} upgraded to ${planType}`);

    } catch (error) {
        console.error('❌ Payment processing error:', error);
        throw error;
    }
}

// Get user's subscription status
export async function getSubscriptionStatus(userId: string) {
    const result = await pool.query(
        `SELECT 
       u.plan,
       u.subscription_status,
       u.monthly_quota,
       u.quota_reset_date,
       s.end_date,
       s.auto_renew,
       s.dodo_subscription_id
     FROM "User" u
     LEFT JOIN "Subscriptions" s ON s.user_id = u.id 
       AND s.payment_status = 'succeeded'
       AND s.end_date >= CURRENT_DATE
     WHERE u.id = $1
     ORDER BY s.end_date DESC
     LIMIT 1`,
        [userId]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    // Get current month usage
    const usageResult = await pool.query(
        `SELECT COUNT(*) as count 
     FROM "API_Usage" 
     WHERE user_id = $1 
     AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`,
        [userId]
    );

    const used = parseInt(usageResult.rows[0].count);

    return {
        plan: user.plan,
        status: user.subscription_status,
        quota: {
            limit: user.monthly_quota,
            used: used,
            remaining: user.monthly_quota - used,
        },
        renewalDate: user.end_date || user.quota_reset_date,
        autoRenew: user.auto_renew ?? true,
    };
}

// Handle subscription cancellation
export async function cancelSubscription(userId: string) {
    const result = await pool.query(
        `UPDATE "Subscriptions"
     SET auto_renew = false, cancelled_at = NOW(), updated_at = NOW()
     WHERE user_id = $1 
     AND payment_status = 'succeeded'
     AND end_date >= CURRENT_DATE
     RETURNING id`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error('No active subscription found');
    }

    return { message: 'Subscription cancelled. Access until end of billing period.' };
}
