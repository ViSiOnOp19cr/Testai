-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create API_Keys table
CREATE TABLE IF NOT EXISTS "API_Keys" (
    id TEXT PRIMARY KEY,
    userid TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    keyhash TEXT NOT NULL,
    keyprefix TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMP DEFAULT NOW()
);

-- Create index on keyprefix for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON "API_Keys"(keyprefix);

-- Create enum type for PLAN
DO $$ BEGIN
    CREATE TYPE "PLAN" AS ENUM ('free', 'paid', 'startups');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update User table to use PLAN enum
-- First, remove the default
ALTER TABLE "User" ALTER COLUMN plan DROP DEFAULT;
-- Then change the type
ALTER TABLE "User" ALTER COLUMN plan TYPE "PLAN" USING plan::"PLAN";
-- Finally, set the default with explicit cast
ALTER TABLE "User" ALTER COLUMN plan SET DEFAULT 'free'::"PLAN";
