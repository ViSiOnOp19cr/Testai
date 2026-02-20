import { DodoPayments } from 'dodopayments';

// Initialize Dodo Payments client
export const dodoClient = new DodoPayments({
    bearerToken: process.env.DODO_SECRET_KEY!,
});

// Product IDs from Dodo dashboard (map to your plan types)
export const DODO_PRODUCTS = {
    pro: process.env.DODO_PRODUCT_ID_PRO || '',
    ultra: process.env.DODO_PRODUCT_ID_ULTRA || '',
} as const;

// Validate config on startup
export function validateDodoConfig() {
    const required = [
        'DODO_SECRET_KEY',
        'DODO_WEBHOOK_SECRET',
        'DODO_PRODUCT_ID_PRO',
        'DODO_PRODUCT_ID_ULTRA',
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.warn(`⚠️  Missing Dodo config: ${missing.join(', ')}`);
        console.warn('Payment features will not work until these are set.');
        return false;
    }
    return true;
}
