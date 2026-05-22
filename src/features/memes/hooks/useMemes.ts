import { useState, useEffect, useCallback } from 'react';
import type { MemeCard } from '@types';
import { memesService } from '../services/memes.service';

interface UseMemesReturn {
  memes: MemeCard[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useMemes = (): UseMemesReturn => {
  const [memes, setMemes] = useState<MemeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memesService.getMemes();
      setMemes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch memes'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { memes, loading, error, refetch: fetch };
};

export default useMemes;
