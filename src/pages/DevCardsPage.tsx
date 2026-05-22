import { useState, useMemo } from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useDevCards } from '@features/dev-cards/hooks/useDevCards';

export default function DevCardsPage() {
  const { cards, loading } = useDevCards();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = useMemo(() => {
    const keys = Array.from(new Set(cards.map(c => c.tagKey).filter(Boolean))) as string[];
    return [{ key: 'all', label: 'All' }, ...keys.map(k => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1) }))];
  }, [cards]);

  const filtered = cards.filter((c) => {
    const matchesFilter = activeFilter === 'all' || c.tagKey === activeFilter;
    const matchesSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} — majdst.codes`).then(() => alert('Copied!')).catch(() => {});
    }
  };

  return (
    <>
      <Navbar />
      <section className="cards-section page-section">
        <div className="section-inner">
          <div className="section-eyebrow">// dev_cards</div>
          <h1 className="section-heading">Knowledge You'll Actually Use</h1>
          <p className="section-sub">Cheat sheets, patterns, and gotchas from real production experience.</p>

          {/* Search + Filter */}
          <div className="page-controls">
            <input
              className="page-search"
              type="search"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search dev cards"
            />
            <div className="page-filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="cards-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="dev-card" style={{ height: 280, background: 'var(--color-surface-2)', borderRadius: 12, opacity: 0.5 }} />
              ))}
            </div>
          ) : (
          <div className="cards-grid">
            {filtered.map((card) => (
              <div className="dev-card" key={card.id}>
                <div className="dev-card-top">
                  <div className="dev-card-icon">{card.icon}</div>
                  <span className={`dev-card-tag tag-${card.tagKey ?? 'other'}`}>{card.tagKey}</span>
                </div>
                <div className="dev-card-body">
                  <div className="dev-card-title">{card.title}</div>
                  <div className="dev-card-desc">{card.description}</div>
                  {card.funFact && <div className="dev-card-meme">{card.funFact}</div>}
                  <div className="dev-card-snippets">
                    {card.topics.map((s, i) => <div key={i} className="snippet">{s}</div>)}
                  </div>
                </div>
                <div className="dev-card-footer">
                  {card.savesCount != null && <span className="card-saves">★ {card.savesCount} saves</span>}
                  <button className="card-share" onClick={() => handleShare(card.title)}>Share Card</button>
                </div>
              </div>
            ))}
          </div>
          )}

          {filtered.length === 0 && (
            <div className="page-empty">
              <p>No cards match your search. Try a different keyword or filter.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
