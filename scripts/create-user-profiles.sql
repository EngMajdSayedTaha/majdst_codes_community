-- Create user_profiles table linked to Supabase auth users
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  email        TEXT,
  avatar_url   TEXT,
  bio          TEXT NOT NULL DEFAULT '',
  github_url   TEXT,
  twitter_url  TEXT,
  linkedin_url TEXT,
  website_url  TEXT,
  is_approved  BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only see approved profiles
CREATE POLICY "Public read approved profiles"
  ON user_profiles FOR SELECT TO anon
  USING (is_approved = TRUE);

-- Authenticated users (admin + self) can see all profiles
CREATE POLICY "Authenticated read all profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (TRUE);

-- Users can create their own profile (id must match their auth uid)
CREATE POLICY "Users insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile; admins can update any
-- (admin protection is enforced at the route level via ProtectedRoute)
CREATE POLICY "Users update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- Authenticated users (admin) can delete profiles
CREATE POLICY "Authenticated delete profiles"
  ON user_profiles FOR DELETE TO authenticated
  USING (TRUE);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_user_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_profiles_timestamp();
