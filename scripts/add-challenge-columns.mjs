/**
 * Adds code_snippet and language columns to the challenges table.
 * Safe to run multiple times (uses ALTER TABLE IF NOT EXISTS pattern).
 * Run: node scripts/add-challenge-columns.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = {};
readFileSync('.env', 'utf-8').split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx === -1) return;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);

const sql = `
DO $$
BEGIN
  -- Add language column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'challenges' AND column_name = 'language'
  ) THEN
    ALTER TABLE public.challenges ADD COLUMN language TEXT;
  END IF;

  -- Add code_snippet column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'challenges' AND column_name = 'code_snippet'
  ) THEN
    ALTER TABLE public.challenges ADD COLUMN code_snippet TEXT;
  END IF;
END $$;
`;

console.log('Run the following SQL in the Supabase SQL Editor:\n');
console.log(sql);
console.log('\nOr copy the SQL above into: Supabase Dashboard → SQL Editor → Run');
