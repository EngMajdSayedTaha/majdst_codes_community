import { useState, useMemo } from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useMemes } from '@features/memes/hooks/useMemes';

export default function MemeLabPage() {
  const { memes, loading } = useMemes();
  const [activeTag, setActiveTag] = useState('All');

  const tags = useMemo(() => {
    const cats = Array.from(new Set(memes.map(m => m.category).filter(Boolean))) as string[];
    return ['All', ...cats];
  }, [memes]);

  const filtered = activeTag === 'All' ? memes : memes.filter((m) => m.category === activeTag);

  return (
    <>
      <Navbar />
      <section className="meme-lab-section">
        <div className="section-inner">
          <div className="section-eyebrow">// meme_lab</div>
          <h1 className="section-heading">Humor With a Hidden Lesson</h1>
          <p className="section-sub">Every meme teaches something real. Because the best way to remember a lesson is to laugh first.</p>

          {/* Tag Filter */}
          <div className="page-filters page-filters-mb">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`filter-btn${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Meme Grid */}
          {loading ? (
            <div className="meme-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="meme-card" style={{ height: 320, opacity: 0.4 }} />
              ))}
            </div>
          ) : (
            <div className="meme-grid">
              {filtered.map((meme) => (
                <div key={meme.id} className="meme-card">
                  <div className="w-full aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                    <img
                      src={meme.imageUrl}
                      alt={meme.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="meme-bottom">{meme.title}</div>
                  {meme.category && <div className="meme-lesson">{meme.category}</div>}
                  {meme.likes != null && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <span>❤️</span>
                      <span>{meme.likes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

