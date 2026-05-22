import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@lib/supabaseClient';

interface DashboardCounts {
  devCards: number;
  community: number;
  challenges: number;
  submissions: number;
  memes: number;
  subscribers: number;
}

const CARDS = [
  { key: 'devCards',     label: 'Dev Cards',    icon: '◫', link: '/admin/dev-cards',   accent: 'bg-violet-500', light: 'bg-violet-50 text-violet-700' },
  { key: 'community',   label: 'Members',       icon: '◈', link: '/admin/community',   accent: 'bg-blue-500',   light: 'bg-blue-50 text-blue-700' },
  { key: 'challenges',  label: 'Challenges',    icon: '⚡', link: '/admin/challenges',  accent: 'bg-amber-500',  light: 'bg-amber-50 text-amber-700' },
  { key: 'submissions', label: 'Submissions',   icon: '◻', link: '/admin/submissions', accent: 'bg-teal-500',   light: 'bg-teal-50 text-teal-700' },
  { key: 'memes',       label: 'Memes',         icon: '◉', link: '/admin/memes',       accent: 'bg-pink-500',   light: 'bg-pink-50 text-pink-700' },
  { key: 'subscribers', label: 'Subscribers',   icon: '✉', link: '/admin/newsletter',  accent: 'bg-emerald-500',light: 'bg-emerald-50 text-emerald-700' },
] as const;

const AdminDashboardPage = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);

  useEffect(() => {
    const load = async () => {
      const [devCards, community, challenges, submissions, memes, subscribers] = await Promise.all([
        supabase.from('dev_cards').select('id', { count: 'exact' }),
        supabase.from('community_members').select('id', { count: 'exact' }),
        supabase.from('challenges').select('id', { count: 'exact' }),
        supabase.from('challenge_submissions').select('id', { count: 'exact' }),
        supabase.from('memes').select('id', { count: 'exact' }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }),
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your majdst.codes content</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {CARDS.map(card => (
          <Link
            key={card.key}
            to={card.link}
            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white ${card.accent}`}>
                {card.icon}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">Manage →</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {counts ? counts[card.key as keyof DashboardCounts] : '—'}
            </div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick links section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/admin/dev-cards', label: '+ Add Dev Card' },
            { to: '/admin/community', label: '+ Add Member' },
            { to: '/admin/challenges', label: '+ New Challenge' },
            { to: '/admin/settings', label: '⚙ Edit Stats' },
          ].map(a => (
            <Link
              key={a.to}
              to={a.to}
              className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-primary hover:text-black hover:bg-yellow-50 transition-all font-medium"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
