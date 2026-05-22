import DevCard from '@features/dev-cards/components/DevCard';
import { useDevCards } from '@features/dev-cards/hooks/useDevCards';


const DevCardsSection = () => {
  const { cards, loading } = useDevCards();

  if (loading) {
    return (
      <section id="dev-cards" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dev-cards" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Learning Resources</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our curated selection of development cards covering essential technologies and concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <DevCard key={card.id} card={card} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/dev-cards"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity gap-2"
          >
            View All Dev Cards
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

export default DevCardsSection;
