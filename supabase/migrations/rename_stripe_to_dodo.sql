-- Run this in Supabase SQL Editor (or via supabase db push)
-- Renames Stripe columns to Dodo Payments columns in the profiles table

ALTER TABLE profiles
  RENAME COLUMN stripe_customer_id     TO dodo_customer_id;

ALTER TABLE profiles
  RENAME COLUMN stripe_subscription_id TO dodo_subscription_id;
