DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_stats' AND policyname='authenticated_select_site_stats') THEN
    CREATE POLICY "authenticated_select_site_stats" ON public.site_stats FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_stats' AND policyname='authenticated_update_site_stats') THEN
    CREATE POLICY "authenticated_update_site_stats" ON public.site_stats FOR UPDATE TO authenticated USING (true);
  END IF;
END $$;
