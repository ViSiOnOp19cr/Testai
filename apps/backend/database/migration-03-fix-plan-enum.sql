-- Migration 03: Fix PLAN Enum Values
-- This migration updates the PLAN enum to support 'pro' and 'ultra' instead of 'paid' and 'startups'

-- Step 1: Remove the default first
ALTER TABLE "User" 
ALTER COLUMN plan DROP DEFAULT;

-- Step 2: Rename old enum and create new one
ALTER TYPE "PLAN" RENAME TO "PLAN_OLD";

CREATE TYPE "PLAN" AS ENUM ('free', 'pro', 'ultra');

-- Step 3: Convert column to TEXT temporarily
ALTER TABLE "User" 
ALTER COLUMN plan TYPE TEXT;

-- Step 4: Update existing values
UPDATE "User" SET plan = 'pro' WHERE plan = 'paid';
UPDATE "User" SET plan = 'ultra' WHERE plan = 'startups';

-- Step 5: Convert to new enum type
ALTER TABLE "User" 
ALTER COLUMN plan TYPE "PLAN" USING plan::"PLAN";

-- Step 6: Now set the default (MUST be done after type conversion)
ALTER TABLE "User" 
ALTER COLUMN plan SET DEFAULT 'free'::"PLAN";

-- Step 7: Drop the old enum
DROP TYPE "PLAN_OLD";

-- Verify the change
SELECT enum_range(NULL::"PLAN") as available_plans;
