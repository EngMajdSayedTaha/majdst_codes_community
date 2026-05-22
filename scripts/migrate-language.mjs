/**
 * Migration: Add language column using supabase client
 * Run with: node scripts/migrate-language.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import https from 'https';

const env = {};
readFileSync('.env', 'utf-8').split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx === -1) return;
  env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
});

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Try reading a row with the language column - if it works, the column exists
const sb = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

console.log('🔍 Checking if language column exists…');
const { error: checkError } = await sb
  .from('challenge_submissions')
  .select('language')
  .limit(1);

if (!checkError) {
  console.log('✅ language column already exists! No migration needed.');
  process.exit(0);
}

console.log('📝 Column not found. Running migration via Management API…');

// Use Supabase Management API to run SQL
const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

const sql = `ALTER TABLE public.challenge_submissions ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'other';`;

const result = await new Promise((resolve, reject) => {
  const postData = JSON.stringify({ query: sql });
  const req = https.request({
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectRef}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => resolve({ status: res.statusCode, body: data }));
  });
  req.on('error', reject);
  req.write(postData);
  req.end();
});

if (result.status >= 200 && result.status < 300) {
  console.log('✅ language column added successfully!');
} else {
  console.error(`⚠️  Migration API returned ${result.status}:`, result.body);
  console.error('\n📋 Please run this SQL manually in Supabase SQL Editor:');
  console.error('─'.repeat(60));
  console.error(sql);
  console.error('─'.repeat(60));
}
