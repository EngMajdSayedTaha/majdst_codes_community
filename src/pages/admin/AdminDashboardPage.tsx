import { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';

interface DashboardCounts {
  devCards: number;
  community: number;
  challenges: number;
  submissions: number;
  memes: number;
  subscribers: number;
}

const AdminDashboardPage = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);

  useEffect(() => {
    const load = async () => {
      const [devCards, community, challenges, submissions, memes, subscribers] = await Promise.all([
        supabase.from('dev_cards').select('id', { count: 'exact', head: true }),
        supabase.from('community_members').select('id', { count: 'exact', head: true }),
        supabase.from('challenges').select('id', { count: 'exact', head: true }),
        supabase.from('challenge_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('memes').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        devCards: devCards.count ?? 0,
        community: community.count ?? 0,
        challenges: challenges.count ?? 0,
        submissions: submissions.count ?? 0,
        memes: memes.count ?? 0,
        subscribers: subscribers.count ?? 0,
      });
    };
    load();
  }, []);

  const items = counts
    ? [
        { label: 'Dev Cards', value: counts.devCards, icon: '📚' },
        { label: 'Community Members', value: counts.community, icon: '👥' },
        { label: 'Challenges', value: counts.challenges, icon: '🏆' },
        { label: 'Submissions', value: counts.submissions, icon: '📝' },
        { label: 'Memes', value: counts.memes, icon: '😂' },
        { label: 'Subscribers', value: counts.subscribers, icon: '📬' },
      ]
    : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      {counts ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.label} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-4xl font-bold text-gray-900">{item.value}</span>
              <span className="text-sm text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Loading…</p>
      )}
    </div>
  );
};

export default AdminDashboardPage;
