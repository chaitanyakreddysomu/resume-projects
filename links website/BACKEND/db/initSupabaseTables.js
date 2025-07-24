const supabase = require('../utils/supabase');

// Supabase does not support DDL (CREATE TABLE) via the JS client directly.
// Table creation must be done via the Supabase SQL editor or API (PostgREST/RPC), not via the JS client.
// This script will check for table existence and print instructions if missing.

async function checkTable(table) {
  const { error } = await supabase.from(table).select('*').limit(1);
  if (error) {
    console.log(`Table '${table}' does not exist. Please create it in Supabase SQL editor.`);
  } else {
    console.log(`Table '${table}' exists.`);
  }
}

async function main() {
  await checkTable('users');
  await checkTable('links');
  await checkTable('withdrawals');
  await checkTable('link_views');
  await checkTable('referrals');
  await checkTable('referral_earnings_log');
  console.log('\n---');
  console.log('If any table is missing, use the following SQL in Supabase SQL editor:');
  console.log('\n-- USERS (Updated with referral field)');
  console.log(`CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname text,
  lastname text,
  email text UNIQUE,
  phone text,
  password text,
  profilephoto text,
  verified boolean DEFAULT false,
  verifyToken text,
  resetToken text,
  resetTokenExpiry timestamp,
  enable2FA boolean DEFAULT false,
  otp text,
  upi1 text,
  upi2 text,
  role text DEFAULT 'user',
  referred_by uuid REFERENCES users(id)
);`);
  console.log('\n-- LINKS');
  console.log(`CREATE TABLE links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  url text,
  originalurl text,
  expirydate date,
  pages integer DEFAULT 4,
  cpm numeric DEFAULT 160,
  clicks integer DEFAULT 0,
  earnings numeric DEFAULT 0,
  createdat timestamp DEFAULT now(),
  status text DEFAULT 'active'
);`);
  console.log('\n-- WITHDRAWALS');
  console.log(`CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount numeric,
  upi text,
  status text,
  date timestamp DEFAULT now(),
  processed_at timestamp,
  processed_by uuid REFERENCES users(id),
  rejection_reason text
);`);
  console.log('\n-- LINK_VIEWS');
  console.log(`CREATE TABLE link_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  user_agent text,
  ip_address text,
  viewed_at timestamp DEFAULT now(),
  UNIQUE(link_id, ip_address, user_agent)
);`);
  console.log('\n-- REFERRALS (New table for tracking referral earnings)');
  console.log(`CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id),
  referred_user_id uuid REFERENCES users(id),
  earnings_amount numeric DEFAULT 0,
  total_referred_earnings numeric DEFAULT 0,
  created_at timestamp DEFAULT now(),
  UNIQUE(referrer_id, referred_user_id)
);`);
  console.log('\n-- Add referred_by column to existing users table (if not exists):');
  console.log(`ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES users(id);`);
  console.log('\n-- Add referred_users column to users table:');
  console.log(`ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_users uuid[] DEFAULT '{}';`);
  console.log('\n-- REFERRAL_EARNINGS_LOG (For tracking individual referral earnings)');
  console.log(`CREATE TABLE IF NOT EXISTS referral_earnings_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount decimal(10,4) NOT NULL,
  source_link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);`);
  console.log('\n-- Create indexes for referral_earnings_log:');
  console.log(`CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_id ON referral_earnings_log(referrer_id);`);
  console.log(`CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_earned_at ON referral_earnings_log(earned_at);`);
  console.log(`CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_earned ON referral_earnings_log(referrer_id, earned_at);`);
}

main(); 