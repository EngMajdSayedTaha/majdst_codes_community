import { useState, useEffect, useCallback } from 'react';
import type { SiteStat } from '@types';
import { siteSettingsService } from '../services/siteSettings.service';

interface UseSiteStatsReturn {
  stats: SiteStat[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useSiteStats = (): UseSiteStatsReturn => {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await siteSettingsService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, error, refetch: fetch };
};

export default useSiteStats;
