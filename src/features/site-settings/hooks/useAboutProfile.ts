import { useState, useEffect, useCallback } from 'react';
import type { AboutProfile } from '@types';
import { siteSettingsService } from '../services/siteSettings.service';

interface UseAboutProfileReturn {
  profile: AboutProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAboutProfile = (): UseAboutProfileReturn => {
  const [profile, setProfile] = useState<AboutProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await siteSettingsService.getAboutProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch about profile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { profile, loading, error, refetch: fetch };
};

export default useAboutProfile;
