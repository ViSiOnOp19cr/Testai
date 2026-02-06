-- Migration 02: Enhanced Payment & Usage Tracking for Dodo Payments
-- Run this after migration-01.sql

-- ============================================================================
-- 1. Enhance Subscriptions table with Dodo Payments fields
-- ============================================================================

ALTER TABLE "Subscriptions" 
ADD COLUMN IF NOT EXISTS dodo_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS dodo_customer_id TEXT,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update payment_status to use enum for better validation
DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('pending', 'succeeded', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 1: Drop the existing default
ALTER TABLE "Subscriptions" 
ALTER COLUMN payment_status DROP DEFAULT;

-- Step 2: Change the column type
ALTER TABLE "Subscriptions" 
ALTER COLUMN payment_status TYPE payment_status_enum 
USING payment_status::payment_status_enum;

-- Step 3: Set the new default with proper enum cast
ALTER TABLE "Subscriptions" 
ALTER COLUMN payment_status SET DEFAULT 'pending'::payment_status_enum;

-- Create index for faster lookups by Dodo IDs
CREATE INDEX IF NOT EXISTS idx_subscriptions_dodo_subscription 
ON "Subscriptions"(dodo_subscription_id) WHERE dodo_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_active 
ON "Subscriptions"(user_id, payment_status) 
WHERE payment_status = 'succeeded';

-- ============================================================================
-- 2. Create Payment_Events table for webhook tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Payment_Events" (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- e.g., 'payment.succeeded', 'subscription.renewed'
    event_data JSONB NOT NULL, -- Full webhook payload from Dodo
    processed BOOLEAN DEFAULT false,
    processing_error TEXT, -- Store any errors during processing
    dodo_event_id TEXT UNIQUE, -- Dodo's event ID for idempotency
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

-- Index for unprocessed events
CREATE INDEX IF NOT EXISTS idx_payment_events_unprocessed 
ON "Payment_Events"(processed, created_at) WHERE processed = false;

-- Index for event types (useful for analytics)
CREATE INDEX IF NOT EXISTS idx_payment_events_type 
ON "Payment_Events"(event_type, created_at);

-- ============================================================================
-- 3. Create Usage_Metrics table for detailed tracking (optional but recommended)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Usage_Metrics" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL, -- GET, POST, etc.
    response_status INTEGER, -- HTTP status code
    response_time_ms INTEGER, -- Response time in milliseconds
    tokens_used INTEGER, -- For LLM API calls
    error_message TEXT, -- If request failed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_usage_metrics_user_date 
ON "Usage_Metrics"(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_metrics_endpoint 
ON "Usage_Metrics"(endpoint, created_at DESC);

-- Index for current month usage (most common query)
CREATE INDEX IF NOT EXISTS idx_usage_metrics_current_month 
ON "Usage_Metrics"(user_id, created_at) 
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);

-- ============================================================================
-- 4. Add helpful function for getting active subscription
-- ============================================================================

CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id TEXT)
RETURNS TABLE (
    subscription_id TEXT,
    plan_type TEXT,
    start_date DATE,
    end_date DATE,
    auto_renew BOOLEAN,
    dodo_subscription_id TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        plan_type,
        start_date,
        end_date,
        auto_renew,
        dodo_subscription_id
    FROM "Subscriptions"
    WHERE user_id = p_user_id
      AND payment_status = 'succeeded'
      AND end_date >= CURRENT_DATE
      AND cancelled_at IS NULL
    ORDER BY end_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- NOTES FOR RUNNING THIS MIGRATION:
-- ============================================================================
-- Run with: psql -d your_database -f migration-02.sql
-- Or through your Node.js migration script
-- 
-- This migration is IDEMPOTENT - safe to run multiple times
-- All operations use IF NOT EXISTS or IF EXISTS checks
