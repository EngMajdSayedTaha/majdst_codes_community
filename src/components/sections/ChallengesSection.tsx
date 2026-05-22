import { useState } from 'react';
import ChallengeCard from '@features/challenges/components/ChallengeCard';
import { useChallenges } from '@features/challenges/hooks/useChallenges';


const ChallengesSection = () => {
  const { challenges, featured: featuredChallenge, loading } = useChallenges();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const otherChallenges = challenges.filter((c) => !c.featured);

  if (loading) {
    return (
      <section id="challenges" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="challenges" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Weekly Challenges</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Test your skills with hands-on challenges. Earn points and climb the leaderboard.
          </p>
        </div>

        {featuredChallenge && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">This Week&apos;s Challenge</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ChallengeCard challenge={featuredChallenge} featured />
            </div>
          </div>
        )}

        <div className="mb-8 flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'active'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Active Challenges
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'completed'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Past Challenges
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherChallenges
            .filter((c) => (activeTab === 'active' ? c.status === 'active' : c.status === 'completed'))
            .map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/challenges"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity gap-2"
          >
            View All Challenges
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
