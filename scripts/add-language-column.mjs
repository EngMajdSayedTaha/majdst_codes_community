/**
 * Migration: Add language column to challenge_submissions
 * Run with: node scripts/add-language-column.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = {};
readFileSync('.env', 'utf-8').split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx < 1) return;
  env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
});

const sb = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

// Check if column exists by trying a select
const { data, error: selectError } = await sb
  .from('challenge_submissions')
  .select('language')
  .limit(1);

if (!selectError) {
  console.log('✅ language column already exists in challenge_submissions');
  process.exit(0);
}

// Column doesn't exist — run ALTER TABLE via rpc or direct SQL
// Use Supabase's SQL editor approach via the REST API
console.log('🔧 Adding language column to challenge_submissions…');

// Try using pg via postgres URL
const pgUrl = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL;
if (!pgUrl) {
  console.error('❌ No POSTGRES_URL found. Please add the language column manually:');
  console.error('   ALTER TABLE public.challenge_submissions ADD COLUMN IF NOT EXISTS language TEXT DEFAULT \'other\';');
  process.exit(1);
}

// Use node-postgres if available, otherwise print instructions
try {
  const { default: pg } = await import('pg').catch(() => null) ?? {};
  if (!pg) {
    throw new Error('pg not available');
  }
  const client = new pg.Client({ connectionString: pgUrl });
  await client.connect();
  await client.query(`
    ALTER TABLE public.challenge_submissions 
    ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'other';
  `);
  await client.end();
  console.log('✅ language column added successfully!');
} catch (err) {
  console.error('⚠️  Could not run migration automatically:', err.message);
  console.error('\nPlease run this SQL in your Supabase SQL editor:');
  console.error('─'.repeat(60));
  console.error(`ALTER TABLE public.challenge_submissions
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'other';`);
  console.error('─'.repeat(60));
}
