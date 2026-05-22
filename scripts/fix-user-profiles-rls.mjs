/**
 * Ensures user_profiles table has correct RLS policies so that:
 * - Authenticated users can INSERT their own profile
 * - Authenticated users can read all profiles (admin + community)
 * - Authenticated users can update any profile (admin management)
 * Run: node scripts/fix-user-profiles-rls.mjs
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

const sql = `
DO $$
BEGIN
  -- Ensure RLS is enabled
  ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

  -- Anon can read approved profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_profiles' AND policyname='anon_read_approved') THEN
    CREATE POLICY "anon_read_approved"
      ON public.user_profiles FOR SELECT TO anon
      USING (is_approved = TRUE);
  END IF;

  -- Authenticated users can read all profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_profiles' AND policyname='auth_read_all') THEN
    CREATE POLICY "auth_read_all"
      ON public.user_profiles FOR SELECT TO authenticated
      USING (TRUE);
  END IF;

  -- Users can insert their own profile
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_profiles' AND policyname='auth_insert_own') THEN
    CREATE POLICY "auth_insert_own"
      ON public.user_profiles FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Users/admin can update any profile
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_profiles' AND policyname='auth_update_any') THEN
    CREATE POLICY "auth_update_any"
      ON public.user_profiles FOR UPDATE TO authenticated
      USING (TRUE) WITH CHECK (TRUE);
  END IF;

  -- Admin can delete profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_profiles' AND policyname='auth_delete_any') THEN
    CREATE POLICY "auth_delete_any"
      ON public.user_profiles FOR DELETE TO authenticated
      USING (TRUE);
  END IF;
END $$;
`;

const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: 'rpc not available' }));
if (error) {
  // Fallback: run each statement individually via the REST API is not possible with anon key
  console.warn('Could not run via RPC. Paste the SQL below into the Supabase SQL Editor:\n');
  console.log(sql);
} else {
  console.log('✓ user_profiles RLS policies applied successfully.');
}
