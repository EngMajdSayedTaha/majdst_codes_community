import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useSiteStats } from '@features/site-settings/hooks/useSiteStats';
import { newsletterService } from '@features/newsletter/services/newsletter.service';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DevCard {
  id: number;
  icon: string;
  tagClass: string;
  tagLabel: string;
  title: string;
  desc: string;
  meme: string;
  snippets: { text: string; html: string }[];
  saves: string;
}

interface Challenge {
  id: number;
  week: string;
  diffClass: string;
  diffLabel: string;
  title: string;
  desc: string;
  tags: string[];
  footer: { left: string; btnLabel: string; btnClass: string };
  featured?: boolean;
}

interface Meme {
  id: number;
  top: string;
  emoji: string;
  bottom: string;
  lesson: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEV_CARDS: DevCard[] = [
  {
    id: 1,
    icon: '⚡',
    tagClass: 'tag-angular',
    tagLabel: 'Angular',
    title: 'The 3 Ways to Unsubscribe (and Which One to Use)',
    desc: "Every Angular dev leaks memory at some point. Here's the complete map of unsubscription patterns with when to use each.",
    meme: '"My app works perfectly." — You, before you opened Task Manager',
    snippets: [
      { text: 'takeUntilDestroyed() // ← best for Angular 16+', html: '<span class="hl">takeUntilDestroyed</span>() <span style="color:#444460">// ← best for Angular 16+</span>' },
      { text: 'async pipe // ← auto-unsub in template', html: '<span class="hlb">async</span> pipe <span style="color:#444460">// ← auto-unsub in template</span>' },
      { text: 'ngOnDestroy + Subject // ← classic way', html: '<span class="hlo">ngOnDestroy</span> + <span class="hl">Subject</span> <span style="color:#444460">// ← classic way</span>' },
    ],
    saves: '★ 834 saves',
  },
  {
    id: 2,
    icon: '🔷',
    tagClass: 'tag-ts',
    tagLabel: 'TypeScript',
    title: 'Stop Using `any`. Use These Instead.',
    desc: 'The 5 TypeScript patterns that replace `any` without making you want to quit your job.',
    meme: '"I\'ll fix the types later." — Your commit from 8 months ago, still in prod',
    snippets: [
      { text: 'unknown // safer any — forces type check', html: '<span class="hlb">unknown</span> <span style="color:#444460">// safer any — forces type check</span>' },
      { text: 'Record<string, unknown> // typed object', html: '<span class="hl">Record&lt;</span><span class="hly">string</span>, <span class="hlb">unknown</span><span class="hl">&gt;</span> <span style="color:#444460">// typed object</span>' },
      { text: 'satisfies // TS 4.9 — infer + validate', html: '<span class="hl">satisfies</span> <span style="color:#444460">// TS 4.9 — infer + validate</span>' },
    ],
    saves: '★ 1.2K saves',
  },
  {
    id: 3,
    icon: '🟣',
    tagClass: 'tag-dotnet',
    tagLabel: '.NET / C#',
    title: 'async/await Mistakes That Bite You in Prod',
    desc: 'The 4 async patterns that look fine in dev, silently destroy performance in production, and make your senior engineer sigh.',
    meme: '"It works on my machine." — Famous last words before the .Result deadlock',
    snippets: [
      { text: '❌ .Result / .Wait() // deadlock waiting room', html: '<span class="hlo">❌</span> .Result / .Wait() <span style="color:#444460">// deadlock waiting room</span>' },
      { text: '✓ await Task.WhenAll() // parallel done right', html: '<span class="hl">✓</span> <span class="hlb">await</span> Task.WhenAll() <span style="color:#444460">// parallel done right</span>' },
      { text: '✓ ConfigureAwait(false) // no context capture', html: '<span class="hl">✓</span> ConfigureAwait(<span class="hly">false</span>) <span style="color:#444460">// no context capture</span>' },
    ],
    saves: '★ 976 saves',
  },
  {
    id: 4,
    icon: '🤖',
    tagClass: 'tag-copilot',
    tagLabel: 'Copilot',
    title: 'GitHub Copilot Prompts That Actually Work',
    desc: "Stop getting garbage suggestions. These prompt patterns get Copilot to generate code you'd actually commit.",
    meme: '"AI will replace devs." — Someone who hasn\'t tried to get it to write a stored proc',
    snippets: [
      { text: '// Given: [context]. Do: [task]. Avoid: [pitfalls]', html: '<span class="hl">// Given: [context]. Do: [task]. Avoid: [pitfalls]</span>' },
      { text: '@workspace /explain this error in simple terms', html: '<span class="hly">@workspace</span> /explain this error in simple terms' },
      { text: '#file:service.ts write a unit test for getData()', html: '<span class="hlb">#file</span>:service.ts write a unit test for getData()' },
    ],
    saves: '★ 2.1K saves',
  },
  {
    id: 5,
    icon: '🗄️',
    tagClass: 'tag-sql',
    tagLabel: 'SQL Server',
    title: 'Stored Proc Debugging Cheat Sheet',
    desc: 'The 6 things to check first when your stored proc works in SSMS but breaks in production. From real debugging sessions.',
    meme: '"The parameter name is literally right there." — You, 2 hours into debugging a typo',
    snippets: [
      { text: '1. Check @param name matches C# exactly', html: '<span class="hl">1.</span> <span style="color:#7070a0">Check @param name matches C# exactly</span>' },
      { text: '2. SET NOCOUNT ON — suppress row counts', html: '<span class="hl">2.</span> <span style="color:#7070a0">SET NOCOUNT ON — suppress row counts</span>' },
      { text: "3. NULL vs empty string — they're different", html: '<span class="hl">3.</span> <span style="color:#7070a0">NULL vs empty string — they\'re different</span>' },
    ],
    saves: '★ 743 saves',
  },
  {
    id: 6,
    icon: '🌿',
    tagClass: 'tag-git',
    tagLabel: 'Git',
    title: 'Git Commands You Use Twice a Year and Always Forget',
    desc: "The commands you Google every single time. Now you don't have to.",
    meme: '"I\'ll just copy-paste from Stack Overflow." — You, for the 47th time this month',
    snippets: [
      { text: 'git stash pop // bring back stashed changes', html: 'git stash pop <span style="color:#444460">// bring back stashed changes</span>' },
      { text: 'git commit --amend --no-edit // fix last commit', html: 'git commit --amend --no-edit <span style="color:#444460">// fix last commit</span>' },
      { text: 'git log --oneline --graph // visual branch tree', html: 'git log --oneline --graph <span style="color:#444460">// visual branch tree</span>' },
    ],
    saves: '★ 1.8K saves',
  },
];

const CHALLENGES: Challenge[] = [
  {
    id: 17,
    week: '🔴 Live Now · Week #17',
    diffClass: 'diff-mid',
    diffLabel: 'Intermediate',
    title: 'Fix the Memory Leak in This Angular Service',
    desc: "This service is running in a real app and it's slowly eating memory. Find the issue, explain why it happens, and show the correct fix with explanation. Bonus points if you can name 2 other places this same mistake hides in Angular apps.",
    tags: ['Angular', 'RxJS', 'Memory', 'Subscriptions'],
    footer: { left: 'Submissions: 47 · Closes in 3 days', btnLabel: 'Submit Solution →', btnClass: 'ch-btn-primary' },
    featured: true,
  },
  {
    id: 16,
    week: 'Week #16',
    diffClass: 'diff-hard',
    diffLabel: 'Hard',
    title: 'Debug the SQL Server Deadlock',
    desc: 'Two stored procs are hitting each other in prod. 3 queries, one deadlock. Find it and fix it.',
    tags: ['SQL Server', 'Deadlock', '.NET'],
    footer: { left: 'Winner: @devhossam_', btnLabel: 'See Solution', btnClass: 'ch-btn-ghost' },
  },
  {
    id: 15,
    week: 'Week #15',
    diffClass: 'diff-easy',
    diffLabel: 'Beginner',
    title: 'TypeScript: Narrow This Type Without Casting',
    desc: "You have an `unknown` type coming from an API. Make it type-safe without a single `as` cast.",
    tags: ['TypeScript', 'Type Guards'],
    footer: { left: 'Winner: @ts_wizard', btnLabel: 'See Solution', btnClass: 'ch-btn-ghost' },
  },
];

const MEMES: Meme[] = [
  { id: 1, top: 'When you finally fix the bug', emoji: '🎉', bottom: '...by commenting out the error handler', lesson: 'Lesson: Suppressing errors ≠ fixing them. Always log before swallowing exceptions.' },
  { id: 2, top: 'Me adding a comment:', emoji: '💬', bottom: '"// This works. Don\'t touch."', lesson: 'Lesson: Comments should explain WHY, not WHAT. The code already says what.' },
  { id: 3, top: 'The PR is ready for review', emoji: '😈', bottom: '+2,847 lines — 3 files changed', lesson: 'Lesson: Small PRs merge faster, catch more bugs, and make everyone like you more.' },
  { id: 4, top: 'It works in dev', emoji: '🔥', bottom: 'Production at 2am:', lesson: 'Lesson: "Works on my machine" is not a deployment strategy. Environment parity saves lives.' },
  { id: 5, top: 'Senior dev reviewing my code:', emoji: '👀', bottom: '"Why is there a TODO from 2021?"', lesson: 'Lesson: TODOs without tickets are wishes. If it matters, create a ticket. If it doesn\'t, delete it.' },
  { id: 6, top: 'Copilot suggestion:', emoji: '🤖', bottom: 'Me: "Perfect." *pushes to main*', lesson: 'Lesson: AI code still needs review. Copilot doesn\'t know your business logic. You do.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const { stats } = useSiteStats();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubStatus('error');
      return;
    }
    try {
      await newsletterService.subscribe(email);
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 4000);
    } catch {
      setSubStatus('error');
    }
  };

  const handleShareCard = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} — majdst.codes`)
        .then(() => alert('Card link copied!'))
        .catch(() => {});
    }
  };

  return (
    <>
      <Navbar />

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

          {/* Hero Card: Live Challenge Preview */}
          <div className="hero-card">
            <div className="hero-card-bar">
              <div className="dot dot-r"></div>
              <div className="dot dot-y"></div>
              <div className="dot dot-g"></div>
              <span className="hero-card-title">challenge_#017.ts</span>
            </div>
            <div className="hero-card-body">
              <div className="challenge-label">Live This Week</div>
              <div className="challenge-title">Why does this Angular service leak memory?</div>
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
                <span className="challenge-meta">47 submissions · 3 days left</span>
                <span className="challenge-badge">Angular</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="statsbar">
        {stats.length > 0
          ? stats.map((stat) => (
              <div key={stat.id} className="stat-item">
                <span className="stat-n">{stat.value}</span>
                <span className="stat-l">{stat.label}</span>
              </div>
            ))
          : (
              <>
                <div className="stat-item"><span className="stat-n">42</span><span className="stat-l">Dev Cards</span></div>
                <div className="stat-item"><span className="stat-n">17</span><span className="stat-l">Challenges</span></div>
                <div className="stat-item"><span className="stat-n">1.2K</span><span className="stat-l">Community Members</span></div>
                <div className="stat-item"><span className="stat-n">Weekly</span><span className="stat-l">New Content</span></div>
              </>
            )
        }
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
            {DEV_CARDS.map((card) => (
              <div className="dev-card" key={card.id} onClick={() => navigate('/dev-cards')}>
                <div className="dev-card-top">
                  <div className="dev-card-icon">{card.icon}</div>
                  <span className={`dev-card-tag ${card.tagClass}`}>{card.tagLabel}</span>
                </div>
                <div className="dev-card-body">
                  <div className="dev-card-title">{card.title}</div>
                  <div className="dev-card-desc">{card.desc}</div>
                  <div className="dev-card-meme">{card.meme}</div>
                  <div className="dev-card-snippets">
                    {card.snippets.map((s, i) => (
                      <div
                        key={i}
                        className="snippet"
                        dangerouslySetInnerHTML={{ __html: s.html }}
                      />
                    ))}
                  </div>
                </div>
                <div className="dev-card-footer">
                  <span className="card-saves">{card.saves}</span>
                  <button
                    className="card-share"
                    onClick={(e) => { e.stopPropagation(); handleShareCard(card.title); }}
                  >
                    Share Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGE BOARD */}
      <section className="challenge-section" id="challenges">
        <div className="section-inner">
          <div className="section-eyebrow">// weekly_challenges</div>
          <h2 className="section-heading">Put Your Skills to the Test</h2>
          <p className="section-sub">
            Real-world problems from actual production code. Every week. Majd reacts to the best solutions on video.
          </p>
          <div className="challenge-board">
            {CHALLENGES.map((ch) => (
              <div key={ch.id} className={`ch-card${ch.featured ? ' featured' : ''}`}>
                <div className="ch-header">
                  <span className="ch-week">{ch.week}</span>
                  <span className={`ch-difficulty ${ch.diffClass}`}>{ch.diffLabel}</span>
                </div>
                <div className="ch-body">
                  <div className="ch-title">{ch.title}</div>
                  <p className="ch-desc">{ch.desc}</p>
                  <div className="ch-tags">
                    {ch.tags.map((tag) => (
                      <span key={tag} className="ch-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="ch-footer">
                  <span className="ch-submissions">{ch.footer.left}</span>
                  <button
                    className={`ch-btn ${ch.footer.btnClass}`}
                    onClick={() => navigate('/challenges')}
                  >
                    {ch.footer.btnLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEME LAB */}
      <div className="meme-strip" id="memes">
        <div className="meme-strip-inner">
          <div className="section-eyebrow">// meme_lab — humor with a hidden lesson</div>
          <div className="meme-scroll">
            {MEMES.map((meme) => (
              <div key={meme.id} className="meme-card" onClick={() => navigate('/meme-lab')}>
                <div className="meme-top">{meme.top}</div>
                <div className="meme-img-area">{meme.emoji}</div>
                <div className="meme-bottom">{meme.bottom}</div>
                <div className="meme-lesson">{meme.lesson}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAJD / ABOUT */}
      <section className="majd-section" id="about">
        <div className="majd-inner">
          <div className="majd-avatar">
            <div className="majd-photo-placeholder">
              <img
                src="/images/profile.jpg"
                alt="Majd"
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
            <h2 className="section-heading">Hey, I'm Majd.</h2>
            <p className="majd-bio">
              <strong>Full-stack software engineer</strong> based in the UAE, building real production
              apps daily — Angular, .NET, SQL Server, Azure. I've hit every bug on this site in actual
              production systems, which means everything here is tested by suffering.<br /><br />
              I started <strong>@majdst_codes</strong> because I was tired of dev content that's either
              too theoretical or just AI tool announcements. This is practical. This is real. And
              sometimes it's a meme.
            </p>
            <div className="majd-stack">
              {['Angular', '.NET / C#', 'TypeScript', 'SQL Server', 'Azure', 'GitHub Copilot', 'Cursor', 'IIS'].map((tech) => (
                <span key={tech} className="stack-pill">{tech}</span>
              ))}
            </div>
            <div className="majd-socials">
              <a href="https://tiktok.com/@majdst_codes" target="_blank" rel="noopener noreferrer" className="social-link">↗ TikTok</a>
              <a href="https://instagram.com/majdst_codes" target="_blank" rel="noopener noreferrer" className="social-link">↗ Instagram</a>
              <a href="https://youtube.com/@majdst_codes" target="_blank" rel="noopener noreferrer" className="social-link">↗ YouTube</a>
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
