-- Update User table with plan details
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS monthly_quota INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS quota_reset_date DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- Simple usage counter table
CREATE TABLE IF NOT EXISTS "API_Usage" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payment/Subscription history
CREATE TABLE IF NOT EXISTS "Subscriptions" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL, -- 'free', 'pro', 'ultra'
    amount DECIMAL(10, 2) NOT NULL,
    payment_id TEXT, -- Dodo payment ID
    payment_status TEXT DEFAULT 'pending', -- pending, success, failed
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_user_month 
    ON "API_Usage"(user_id, created_at) 
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);