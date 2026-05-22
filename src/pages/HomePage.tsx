import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import ViewModal, { type ModalItem } from '@components/common/ViewModal';
import { useSiteStats } from '@features/site-settings/hooks/useSiteStats';
import { useAboutProfile } from '@features/site-settings/hooks/useAboutProfile';
import { useDevCards } from '@features/dev-cards/hooks/useDevCards';
import { useChallenges } from '@features/challenges/hooks/useChallenges';
import { useMemes } from '@features/memes/hooks/useMemes';
import { newsletterService } from '@features/newsletter/services/newsletter.service';
import { siteSettingsService } from '@features/site-settings/services/siteSettings.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TAG_MAP: Record<string, { cls: string; label: string }> = {
  angular:    { cls: 'tag-angular', label: 'Angular' },
  typescript: { cls: 'tag-ts',      label: 'TypeScript' },
  dotnet:     { cls: 'tag-dotnet',  label: '.NET / C#' },
  git:        { cls: 'tag-git',     label: 'Git' },
  copilot:    { cls: 'tag-copilot', label: 'Copilot' },
  sql:        { cls: 'tag-sql',     label: 'SQL Server' },
  react:      { cls: 'tag-ts',      label: 'React' },
  nodejs:     { cls: 'tag-git',     label: 'Node.js' },
  css:        { cls: 'tag-ts',      label: 'CSS' },
  api:        { cls: 'tag-dotnet',  label: 'API' },
  docker:     { cls: 'tag-git',     label: 'Docker' },
};

const DIFF_MAP: Record<string, { cls: string; label: string }> = {
  easy:   { cls: 'diff-easy', label: 'Beginner' },
  medium: { cls: 'diff-mid',  label: 'Intermediate' },
  hard:   { cls: 'diff-hard', label: 'Hard' },
};

function fmtSaves(n?: number): string {
  if (!n) return '';
  return n >= 1000 ? `★ ${(n / 1000).toFixed(1)}K saves` : `★ ${n} saves`;
}

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return String(n);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const { stats } = useSiteStats();
  const { profile } = useAboutProfile();
  const { cards } = useDevCards();
  const { challenges, featured } = useChallenges();
  const { memes } = useMemes();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [modal, setModal] = useState<ModalItem | null>(null);
  const [toast, setToast] = useState('');
  const [liveCounts, setLiveCounts] = useState<{ cards: number; challenges: number; members: number } | null>(null);

  useEffect(() => {
    siteSettingsService.getLiveCounts()
      .then(setLiveCounts)
      .catch(() => {}); // silently fall back to site_stats
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setSubStatus('error'); return; }
    try {
      await newsletterService.subscribe(email);
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 4000);
    } catch {
      setSubStatus('error');
    }
  };

  const handleShare = (e: React.MouseEvent, title: string, path: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      navigator.share({ title, text: `Check this out on majdst.codes`, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => showToast('🔗 Link copied to clipboard!')).catch(() => {});
    }
  };

  // Stats bar: prefer live counts, fall back to site_stats from DB
  const statsItems = liveCounts
    ? [
        { label: 'Dev Cards',      value: fmtCount(liveCounts.cards) },
        { label: 'Challenges',     value: fmtCount(liveCounts.challenges) },
        { label: 'Members',        value: fmtCount(liveCounts.members) },
        { label: 'New Content',    value: 'Weekly' },
      ]
    : stats.map(s => ({
        label: s.label,
        // Never show a raw "0" or number for the "New Content" stat — always "Weekly"
        value: s.label.toLowerCase().includes('content') ? 'Weekly' : s.value,
      }));

  return (
    <>
      <Navbar />
      <ViewModal
        item={modal}
        onClose={() => setModal(null)}
        tagLabel={(k) => TAG_MAP[k]?.label ?? k}
        diffLabel={(d) => DIFF_MAP[d]?.label ?? d}
      />
      {toast && <div className="share-toast">{toast}</div>}

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-tag">Dev Knowledge. Real Talk. No BS.</div>
            <h1 className="hero-title">
              CODE.<br />
              <span className="accent-primary">MEME.</span><br />
              <span className="accent-orange">REPEAT.</span>
            </h1>
            <p className="hero-desc">
              Where software engineers get their weekly dose of practical knowledge, brutal honesty, and
              memes that actually teach you something. Built by a dev, for devs.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo('cards')}>
                Explore Dev Cards
              </button>
              <button className="btn-ghost" onClick={() => scrollTo('challenges')}>
                This Week's Challenge →
              </button>
            </div>
          </div>

          {/* Hero Card: Live Challenge Preview (from DB featured challenge) */}
          <div
            className="hero-card"
            style={{ cursor: 'pointer' }}
            onClick={() => featured && setModal({ type: 'challenge', data: featured })}
          >
            <div className="hero-card-bar">
              <div className="dot dot-r"></div>
              <div className="dot dot-y"></div>
              <div className="dot dot-g"></div>
              <span className="hero-card-title">
                challenge_#{String(featured?.week ?? 17).padStart(3, '0')}.ts
              </span>
            </div>
            <div className="hero-card-body">
              <div className="challenge-label">Live This Week</div>
              <div className="challenge-title">
                {featured?.title ?? 'Why does this Angular service leak memory?'}
              </div>
              <div className="code-block">
                <span className="code-comment">{'// Something\'s wrong here...'}</span><br />
                <span className="code-keyword">@Injectable</span>{'({ providedIn: '}<span className="code-string">'root'</span>{' })'}<br />
                <span className="code-keyword">export class </span><span className="code-type">DataService</span>{' {'}<br />
                &nbsp;&nbsp;<span className="code-fn">getData</span>{'() {'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return </span><span className="code-keyword">this</span>{'.http'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span className="code-fn">get</span>{'('}<span className="code-string">'/api/data'</span>{')'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span className="code-fn">subscribe</span>{'(res => {'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">this</span>{'.data = res;'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'});'}<br />
                &nbsp;&nbsp;{'}'}<br />
                {'}'}
              </div>
              <div className="challenge-footer">
                <span className="challenge-meta">
                  {featured ? `Week #${featured.week} · Active` : '47 submissions · 3 days left'}
                </span>
                <span className="challenge-badge">
                  {featured?.tags?.[0] ?? 'Angular'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — live counts from DB */}
      <div className="statsbar">
        {statsItems.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-n">{((Number(s.value) || 0) * 10).toLocaleString()}+</span>
            <span className="stat-l">{s.label}</span>
          </div>
        ))}
      </div>

      {/* DEV CARDS */}
      <section className="cards-section" id="cards">
        <div className="section-inner">
          <div className="section-eyebrow">// dev_cards</div>
          <h2 className="section-heading">Knowledge You'll Actually Use</h2>
          <p className="section-sub">
            Cheat sheets, patterns, and gotchas from real production experience. With the meme that explains why it matters.
          </p>
          <div className="cards-grid">
            {cards.map((card) => {
              const tag = TAG_MAP[card.tagKey ?? ''] ?? { cls: 'tag-ts', label: card.tagKey ?? '' };
              return (
                <div
                  className="dev-card"
                  key={card.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setModal({ type: 'card', data: card })}
                >
                  <div className="dev-card-top">
                    <div className="dev-card-icon">{card.icon}</div>
                    <span className={`dev-card-tag ${tag.cls}`}>{tag.label}</span>
                  </div>
                  <div className="dev-card-body">
                    <div className="dev-card-title">{card.title}</div>
                    <div className="dev-card-desc">{card.description}</div>
                    {card.funFact && <div className="dev-card-meme">{card.funFact}</div>}
                  </div>
                  <div className="dev-card-footer">
                    <span className="card-saves">{fmtSaves(card.savesCount)}</span>
                    <button
                      className="card-share"
                      onClick={(e) => handleShare(e, card.title, '/dev-cards')}
                    >
                      Share Card
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="section-cta-row">
            <a href="/dev-cards" className="section-view-all">View All Dev Cards →</a>
          </div>
        </div>
      </section>
      <section className="challenge-section" id="challenges">
        <div className="section-inner">
          <div className="section-eyebrow">// weekly_challenges</div>
          <h2 className="section-heading">Put Your Skills to the Test</h2>
          <p className="section-sub">
            Real-world problems from actual production code. Every week. Majd reacts to the best solutions on video.
          </p>
          <div className="challenge-board">
            {challenges.map((ch) => {
              const diff = DIFF_MAP[ch.difficulty] ?? { cls: 'diff-mid', label: ch.difficulty };
              const weekLabel = ch.featured && ch.status === 'active'
                ? `🔴 Live Now · Week #${ch.week}`
                : `Week #${ch.week}`;
              const footerLeft = ch.status === 'completed' && ch.winnerHandle
                ? `Winner: ${ch.winnerHandle}`
                : ch.status === 'active' ? 'Active Challenge' : '';
              return (
                <div
                  key={ch.id}
                  className={`ch-card${ch.featured ? ' featured' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setModal({ type: 'challenge', data: ch })}
                >
                  <div className="ch-header">
                    <span className="ch-week">{weekLabel}</span>
                    <span className={`ch-difficulty ${diff.cls}`}>{diff.label}</span>
                  </div>
                  <div className="ch-body">
                    <div className="ch-title">{ch.title}</div>
                    <p className="ch-desc">{ch.description}</p>
                    <div className="ch-tags">
                      {(ch.tags ?? []).map((tag) => (
                        <span key={tag} className="ch-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ch-footer">
                    <span className="ch-submissions">{footerLeft}</span>
                    <button
                      className={`ch-btn ${ch.status === 'active' ? 'ch-btn-primary' : 'ch-btn-ghost'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ch.status === 'active') {
                          navigate('/challenges');
                        } else {
                          setModal({ type: 'challenge', data: ch });
                        }
                      }}
                    >
                      {ch.status === 'active' ? 'Submit Solution →' : 'See Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="section-cta-row">
            <a href="/challenges" className="section-view-all">View All Challenges →</a>
          </div>
        </div>
      </section>
      <div className="meme-strip" id="memes">
        <div className="meme-strip-inner">
          <div className="section-eyebrow">// meme_lab — humor with a hidden lesson</div>
          <div className="meme-scroll">
            {memes.map((meme) => (
              <div
                key={meme.id}
                className="meme-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/meme-lab')}
              >
                <div className="meme-img-area">
                  <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="meme-bottom">{meme.title}</div>
                <div className="meme-lesson">{meme.category}</div>
              </div>
            ))}
          </div>
          <div className="section-cta-row" style={{ marginTop: '1.5rem' }}>
            <a href="/meme-lab" className="section-view-all">View All Memes →</a>
          </div>
        </div>
      </div>

      {/* MAJD / ABOUT */}
      <section className="majd-section" id="about">
        <div className="majd-inner">
          <div className="majd-avatar">
            <div className="majd-photo-placeholder">
              <img
                src={profile?.avatarUrl || '/images/profile.jpg'}
                alt={profile?.name ?? 'Majd'}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                className="profile-avatar-large w-full h-full object-cover"
              />
              <div className="majd-frame"></div>
              <div className="majd-initials" style={{ display: 'none' }}>M</div>
            </div>
            <div className="majd-handle">@majdst_codes</div>
          </div>
          <div className="majd-content">
            <div className="section-eyebrow">// the_human_behind_this</div>
            <h2 className="section-heading">Hey, I'm {profile?.name?.split(' ')[0] ?? 'Majd'}.</h2>
            <p className="majd-bio">
              {profile?.bio
                ? <><strong>{profile.bio.split(',')[0]}</strong>{profile.bio.slice(profile.bio.indexOf(','))}</>
                : (
                  <><strong>Full-stack software engineer</strong> based in the UAE, building real production
                  apps daily — Angular, .NET, SQL Server, Azure. I've hit every bug on this site in actual
                  production systems, which means everything here is tested by suffering.</>
                )
              }
              {profile?.bioExtended && <><br /><br />{profile.bioExtended}</>}
            </p>
            <div className="majd-stack">
              {['Angular', '.NET / C#', 'TypeScript', 'SQL Server', 'Azure', 'GitHub Copilot', 'Cursor', 'IIS'].map((tech) => (
                <span key={tech} className="stack-pill">{tech}</span>
              ))}
            </div>
            <div className="majd-socials">
              <a href={profile?.discordUrl ?? 'https://tiktok.com/@majdst_codes'} target="_blank" rel="noopener noreferrer" className="social-link">↗ TikTok</a>
              <a href={profile?.twitterUrl ?? 'https://instagram.com/majdst_codes'} target="_blank" rel="noopener noreferrer" className="social-link">↗ Instagram</a>
              <a href={profile?.telegramUrl ?? 'https://youtube.com/@majdst_codes'} target="_blank" rel="noopener noreferrer" className="social-link">↗ YouTube</a>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="section-eyebrow">// join_the_community</div>
        <h2 className="section-heading">
          Get the Weekly <span className="primary">DevDose</span>
        </h2>
        <p className="cta-sub">One dev card, one challenge, one meme. Every week. No AI news. No fluff.</p>
        <form className="cta-input-row" onSubmit={handleSubscribe} noValidate>
          <input
            className={`cta-input${subStatus === 'error' ? ' input-error' : ''}`}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSubStatus('idle'); }}
            aria-label="Email address"
          />
          <button className="cta-submit" type="submit">Subscribe →</button>
        </form>
        {subStatus === 'success' && (
          <p className="cta-status success">✓ You're in. Weekly DevDose incoming.</p>
        )}
        {subStatus === 'error' && (
          <p className="cta-status error">✗ Enter a valid email address.</p>
        )}
      </section>

      <Footer />
    </>
  );
}

