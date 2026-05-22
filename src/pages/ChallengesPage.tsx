import { useState, FormEvent } from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useChallenges } from '@features/challenges/hooks/useChallenges';
import { challengesService } from '@features/challenges/services/challenges.service';

const DIFF_CLASS: Record<string, string> = { easy: 'diff-easy', medium: 'diff-mid', hard: 'diff-hard' };
const DIFF_LABEL: Record<string, string> = { easy: 'Beginner', medium: 'Intermediate', hard: 'Hard' };

export default function ChallengesPage() {
  const { challenges, featured: liveChallenge } = useChallenges();
  const [showForm, setShowForm] = useState(false);
  const [solution, setSolution] = useState('');
  const [handle, setHandle] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const pastChallenges = challenges.filter((c) => !c.featured);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!solution.trim() || !handle.trim() || !liveChallenge) {
      setSubmitStatus('error');
      return;
    }
    try {
      await challengesService.submitChallenge({
        challengeId: liveChallenge.id,
        handle: handle.trim(),
        solution: solution.trim(),
      });
    } catch {
      setSubmitStatus('error');
      return;
    }
    setSubmitStatus('success');
    setShowForm(false);
    setSolution('');
    setHandle('');
    setTimeout(() => setSubmitStatus('idle'), 5000);
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

          {submitStatus === 'success' && (
            <p className="cta-status success success-banner">
              ✓ Solution submitted! Majd will review it this week.
            </p>
          )}

          {/* Live Challenge */}
          {liveChallenge && (
            <div className="ch-card featured challenge-live-gap">
              <div className="ch-header">
                <span className="ch-week">🔴 Live Now · Week #{liveChallenge.week}</span>
                <span className={`ch-difficulty ${DIFF_CLASS[liveChallenge.difficulty] ?? 'diff-mid'}`}>{DIFF_LABEL[liveChallenge.difficulty] ?? liveChallenge.difficulty}</span>
              </div>
              <div className="ch-body">
                <div className="ch-title">{liveChallenge.title}</div>
                <p className="ch-desc">{liveChallenge.description}</p>
                <div className="ch-tags">
                  {(liveChallenge.tags ?? []).map((t) => <span key={t} className="ch-tag">{t}</span>)}
                </div>
              </div>
              <div className="ch-footer">
                <span className="ch-submissions">Active</span>
                <button className="ch-btn ch-btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Submit Solution →'}
                </button>
              </div>
            </div>
          )}

          {/* Submission Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="submit-form" noValidate>
              <div className="section-eyebrow section-eyebrow-sm">// submit_your_solution</div>
              <input
                className="cta-input"
                type="text"
                placeholder="@your_handle (TikTok / Instagram)"
                value={handle}
                onChange={(e) => { setHandle(e.target.value); setSubmitStatus('idle'); }}
                aria-label="Your handle"
              />
              <textarea
                className="submit-textarea"
                placeholder="Paste your solution or explain your approach..."
                value={solution}
                onChange={(e) => { setSolution(e.target.value); setSubmitStatus('idle'); }}
                rows={8}
                aria-label="Your solution"
              />
              <div className="submit-footer-row">
                {submitStatus === 'error' && <span className="cta-status error">✗ Fill in all fields.</span>}
                <div className="submit-right">
                  <button type="submit" className="ch-btn ch-btn-primary">Submit →</button>
                </div>
              </div>
            </form>
          )}

          {/* Past Challenges */}
          <div>
            <div className="section-eyebrow past-challenges-header">// past_challenges</div>
            <div className="challenge-board">
              {pastChallenges.map((ch) => (
                <div key={ch.id} className="ch-card">
                  <div className="ch-header">
                    <span className="ch-week">Week #{ch.week}</span>
                    <span className={`ch-difficulty ${DIFF_CLASS[ch.difficulty] ?? 'diff-mid'}`}>{DIFF_LABEL[ch.difficulty] ?? ch.difficulty}</span>
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

