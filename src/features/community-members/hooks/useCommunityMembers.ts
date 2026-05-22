import { useState, useEffect, useCallback } from 'react';
import type { CommunityMember } from '@types';
import { communityMembersService } from '../services/communityMembers.service';

interface UseCommunityMembersReturn {
  members: CommunityMember[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCommunityMembers = (featuredOnly = false): UseCommunityMembersReturn => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = featuredOnly
        ? await communityMembersService.getFeaturedMembers()
        : await communityMembersService.getMembers();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch community members'));
    } finally {
      setLoading(false);
    }
  }, [featuredOnly]);

  useEffect(() => { fetch(); }, [fetch]);

  return { members, loading, error, refetch: fetch };
};

export default useCommunityMembers;
