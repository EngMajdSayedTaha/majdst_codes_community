/**
 * Add RLS policy for authenticated users to read site_stats
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
  { db: { schema: 'public' } }
);

// Use rpc to execute raw SQL — requires service role
const sql = `
  DO $$
  BEGIN
    -- Allow any authenticated user to SELECT site_stats
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'site_stats'
        AND policyname = 'authenticated_select_site_stats'
    ) THEN
      CREATE POLICY "authenticated_select_site_stats"
      ON public.site_stats
      FOR SELECT
      TO authenticated
      USING (true);
    END IF;

    -- Allow any authenticated user to UPDATE site_stats
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'site_stats'
        AND policyname = 'authenticated_update_site_stats'
    ) THEN
      CREATE POLICY "authenticated_update_site_stats"
      ON public.site_stats
      FOR UPDATE
      TO authenticated
      USING (true);
    END IF;

    -- Allow any authenticated user to INSERT into site_stats
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'site_stats'
        AND policyname = 'authenticated_insert_site_stats'
    ) THEN
      CREATE POLICY "authenticated_insert_site_stats"
      ON public.site_stats
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
    END IF;
  END $$;
`;

const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: { message: 'rpc not available' } }));

if (error) {
  // Fallback: just verify we can read with service role, then apply anon policy differently
  console.log('Note: exec_sql RPC not available. Policies must be added via Supabase Dashboard.');
  console.log('');
  console.log('Please run this SQL in the Supabase SQL Editor:');
  console.log(sql);
} else {
  console.log('✅ RLS policies added successfully');
}
