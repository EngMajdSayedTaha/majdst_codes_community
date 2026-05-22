import { useState, FormEvent, useRef, useEffect } from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useChallenges } from '@features/challenges/hooks/useChallenges';
import { challengesService } from '@features/challenges/services/challenges.service';
import CodeEditor from '@features/challenges/components/CodeEditor';
import { useUserAuth } from '@features/auth';

const DIFF_CLASS: Record<string, string> = { easy: 'diff-easy', medium: 'diff-mid', hard: 'diff-hard' };
const DIFF_LABEL: Record<string, string> = { easy: 'Beginner', medium: 'Intermediate', hard: 'Hard' };

interface SubmittedInfo {
  handle: string;
  language: string;
  lines: number;
  challengeTitle: string;
  week: number | undefined;
}

export default function ChallengesPage() {
  const { challenges, featured: liveChallenge } = useChallenges();
  const { user, openAuthModal } = useUserAuth();
  const [showForm, setShowForm] = useState(false);
  const [solution, setSolution]   = useState('');
  const [language, setLanguage]   = useState('python');
  const [handle, setHandle]       = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [submitted, setSubmitted] = useState<SubmittedInfo | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Pre-fill handle from logged-in user's display name
  useEffect(() => {
    if (user && !handle) {
      const name =
        (user.user_metadata?.display_name as string | undefined) ??
        user.email?.split('@')[0] ??
        '';
      setHandle(name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const pastChallenges = challenges.filter((c) => !c.featured);

  const resetForm = () => {
    setSolution('');
    setLanguage('python');
    setHandle('');
    setSubmitStatus('idle');
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!solution.trim() || !handle.trim() || !liveChallenge) {
      setSubmitStatus('error');
      return;
    }
    setSubmitStatus('submitting');
    try {
      await challengesService.submitChallenge({
        challengeId: liveChallenge.id,
        handle:   handle.trim(),
        solution: solution.trim(),
        language,
      });
    } catch {
      setSubmitStatus('error');
      return;
    }
    setSubmitted({
      handle:         handle.trim(),
      language,
      lines:          solution.trim().split('\n').length,
      challengeTitle: liveChallenge.title,
      week:           liveChallenge.week,
    });
    resetForm();
    // scroll to success panel
    setTimeout(() => {
      document.getElementById('submission-success')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  return (
    <>
      <Navbar />
      <section className="challenge-section page-section">
        <div className="section-inner">
          <div className="section-eyebrow">// weekly_challenges</div>
          <h1 className="section-heading">Put Your Skills to the Test</h1>
          <p className="section-sub">
            Real-world problems from actual production code. Every week. Majd reacts to the best solutions on video.
          </p>

          {/* ── Submission Success Panel ─────────────────────────────── */}
          {submitted && (
            <div id="submission-success" className="submission-success-panel">
              <div className="ss-glow" aria-hidden="true" />
              <div className="ss-icon">✦</div>
              <div className="ss-heading">Solution Submitted!</div>
              <p className="ss-sub">
                Your <span className="ss-accent">{submitted.language}</span> solution ({submitted.lines} {submitted.lines === 1 ? 'line' : 'lines'}) for
                <br />
                <span className="ss-challenge">Week #{submitted.week} — {submitted.challengeTitle}</span>
                <br />
                has been received as <span className="ss-handle">{submitted.handle}</span>.
              </p>
              <div className="ss-steps">
                <div className="ss-step ss-step-done">
                  <span className="ss-step-icon">✓</span>
                  <span>Solution received</span>
                </div>
                <div className="ss-step-connector" />
                <div className="ss-step ss-step-pending">
                  <span className="ss-step-icon">⏳</span>
                  <span>Majd reviews it</span>
                </div>
                <div className="ss-step-connector" />
                <div className="ss-step ss-step-pending">
                  <span className="ss-step-icon">🎬</span>
                  <span>Featured on video</span>
                </div>
              </div>
              <button
                className="ch-btn ch-btn-ghost ss-dismiss"
                onClick={() => setSubmitted(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ── Live Challenge ───────────────────────────────────────── */}
          {liveChallenge && (
            <div className="ch-card featured challenge-live-gap">
              <div className="ch-header">
                <span className="ch-week">🔴 Live Now · Week #{liveChallenge.week}</span>
                <span className={`ch-difficulty ${DIFF_CLASS[liveChallenge.difficulty] ?? 'diff-mid'}`}>
                  {DIFF_LABEL[liveChallenge.difficulty] ?? liveChallenge.difficulty}
                </span>
              </div>
              <div className="ch-body">
                <div className="ch-title">{liveChallenge.title}</div>
                <p className="ch-desc">{liveChallenge.description}</p>
                <div className="ch-tags">
                  {(liveChallenge.tags ?? []).map((t) => (
                    <span key={t} className="ch-tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="ch-footer">
                <span className="ch-submissions">Active</span>
                <button
                  className={`ch-btn ${showForm ? 'ch-btn-ghost' : 'ch-btn-primary'}`}
                  onClick={() => {
                    if (!user) {
                      openAuthModal({ mode: 'login' });
                      return;
                    }
                    setShowForm(p => !p);
                    setSubmitStatus('idle');
                  }}
                >
                  {showForm ? '✕ Cancel' : 'Submit Solution →'}
                </button>
              </div>
            </div>
          )}

          {/* ── Submission Form ──────────────────────────────────────── */}
          {showForm && (
            <div ref={formRef} className="submit-form-wrap">
              <form onSubmit={handleSubmit} className="submit-form" noValidate>
                <div className="submit-form-header">
                  <div className="section-eyebrow section-eyebrow-sm">// submit_your_solution</div>
                  <p className="submit-form-hint">
                    Write your code below — Majd will review and may feature it in this week's video.
                  </p>
                </div>

                {/* Handle input */}
                <div className="submit-field">
                  <label className="submit-label" htmlFor="sol-handle">
                    Your Handle
                  </label>
                  <input
                    id="sol-handle"
                    className={`cta-input${submitStatus === 'error' && !handle.trim() ? ' input-error' : ''}`}
                    type="text"
                    placeholder="@your_handle  (TikTok / Instagram / GitHub)"
                    value={handle}
                    onChange={(e) => { setHandle(e.target.value); setSubmitStatus('idle'); }}
                    aria-label="Your social handle"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {/* Code editor */}
                <div className="submit-field">
                  <label className="submit-label">
                    Your Solution&nbsp;
                    <span className="submit-label-hint">— pick a language, then paste or write your code</span>
                  </label>
                  <CodeEditor
                    value={solution}
                    onChange={(v) => { setSolution(v); setSubmitStatus('idle'); }}
                    language={language}
                    onLanguageChange={setLanguage}
                    hasError={submitStatus === 'error' && !solution.trim()}
                    minRows={14}
                  />
                </div>

                {/* Footer row */}
                <div className="submit-footer-row">
                  <div>
                    {submitStatus === 'error' && (
                      <span className="cta-status error">
                        ✗ {!handle.trim() ? 'Enter your handle.' : !solution.trim() ? 'Write your solution.' : 'Something went wrong — try again.'}
                      </span>
                    )}
                  </div>
                  <div className="submit-right">
                    <button
                      type="button"
                      className="ch-btn ch-btn-ghost"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ch-btn ch-btn-primary"
                      disabled={submitStatus === 'submitting'}
                    >
                      {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Solution →'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── Past Challenges ──────────────────────────────────────── */}
          <div>
            <div className="section-eyebrow past-challenges-header">// past_challenges</div>
            <div className="challenge-board">
              {pastChallenges.map((ch) => (
                <div key={ch.id} className="ch-card">
                  <div className="ch-header">
                    <span className="ch-week">Week #{ch.week}</span>
                    <span className={`ch-difficulty ${DIFF_CLASS[ch.difficulty] ?? 'diff-mid'}`}>
                      {DIFF_LABEL[ch.difficulty] ?? ch.difficulty}
                    </span>
                  </div>
                  <div className="ch-body">
                    <div className="ch-title">{ch.title}</div>
                    <p className="ch-desc">{ch.description}</p>
                    <div className="ch-tags">
                      {(ch.tags ?? []).map((t) => <span key={t} className="ch-tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="ch-footer">
                    {ch.winnerHandle
                      ? <span className="ch-submissions">Winner: <span>{ch.winnerHandle}</span></span>
                      : <span className="ch-submissions">Closed</span>
                    }
                    <button className="ch-btn ch-btn-ghost">See Solution</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

