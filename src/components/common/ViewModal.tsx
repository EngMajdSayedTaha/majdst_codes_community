import { useEffect, useCallback, useState, FormEvent } from 'react';
import type { DevCard, Challenge, MemeCard } from '@types';
import CodeEditor, { LANGUAGES } from '@features/challenges/components/CodeEditor';
import { challengesService } from '@features/challenges/services/challenges.service';

export type ModalItem =
  | { type: 'card'; data: DevCard }
  | { type: 'challenge'; data: Challenge }
  | { type: 'meme'; data: MemeCard };

interface ViewModalProps {
  item: ModalItem | null;
  onClose: () => void;
  tagLabel?: (tagKey: string) => string;
  diffLabel?: (diff: string) => string;
}

const TAG_COLORS: Record<string, string> = {
  angular:    '#e40035',
  typescript: '#3178c6',
  dotnet:     '#512bd4',
  git:        '#f05032',
  copilot:    '#F9E400',
  sql:        '#cc2927',
  react:      '#61dafb',
  nodejs:     '#68a063',
  css:        '#264de4',
  api:        '#512bd4',
  docker:     '#2496ed',
};

const DIFF_COLORS: Record<string, string> = {
  easy:   '#22c55e',
  medium: '#f59e0b',
  hard:   '#ef4444',
  beginner:     '#22c55e',
  intermediate: '#f59e0b',
  advanced:     '#ef4444',
};

export default function ViewModal({ item, onClose, tagLabel, diffLabel }: ViewModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!item) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [item, handleKey]);

  if (!item) return null;

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="view-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="view-modal-card" onClick={stopProp}>
        <button className="view-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {item.type === 'card' && <DevCardView card={item.data} tagLabel={tagLabel} />}
        {item.type === 'challenge' && <ChallengeView ch={item.data} diffLabel={diffLabel} />}
        {item.type === 'meme' && <MemeView meme={item.data} />}
      </div>
    </div>
  );
}

/* ── Dev Card Detail ── */
function DevCardView({ card, tagLabel }: { card: DevCard; tagLabel?: (k: string) => string }) {
  const tagColor = TAG_COLORS[card.tagKey ?? ''] ?? '#F9E400';
  const label = tagLabel?.(card.tagKey ?? '') ?? card.tagKey ?? '';
  return (
    <div className="vm-devcard">
      <div className="vm-devcard-head">
        <span className="vm-icon">{card.icon}</span>
        <div>
          <div className="vm-tag" style={{ color: tagColor, borderColor: tagColor }}>
            {label}
          </div>
          {card.learningTime && (
            <div className="vm-time">⏱ {card.learningTime}</div>
          )}
        </div>
      </div>
      <h2 className="vm-title">{card.title}</h2>
      <p className="vm-desc">{card.description}</p>

      {card.topics && card.topics.length > 0 && (
        <div className="vm-topics">
          {card.topics.map((t) => (
            <span key={t} className="vm-topic-pill">{t}</span>
          ))}
        </div>
      )}

      {card.funFact && (
        <blockquote className="vm-funfact">
          <span className="vm-funfact-icon">💡</span>
          {card.funFact}
        </blockquote>
      )}

      <div className="vm-footer">
        {card.savesCount ? (
          <span className="vm-saves">
            ★ {card.savesCount >= 1000
              ? `${(card.savesCount / 1000).toFixed(1)}K saves`
              : `${card.savesCount} saves`}
          </span>
        ) : null}
        {card.link && (
          <a href={card.link} target="_blank" rel="noopener noreferrer" className="vm-link">
            Open Resource ↗
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Challenge Detail ── */
function ChallengeView({ ch, diffLabel }: { ch: Challenge; diffLabel?: (d: string) => string }) {
  const diffColor = DIFF_COLORS[ch.difficulty] ?? '#f59e0b';
  const label = diffLabel?.(ch.difficulty) ?? ch.difficulty;
  const isActive = ch.status === 'active';

  const [handle, setHandle]     = useState('');
  const [code, setCode]         = useState('');
  const [lang, setLang]         = useState('python');
  const [status, setStatus]     = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const langLabel = LANGUAGES.find(l => l.value === lang)?.label ?? lang;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!handle.trim() || !code.trim()) { setStatus('error'); return; }
    setStatus('submitting');
    try {
      await challengesService.submitChallenge({
        challengeId: ch.id,
        handle: handle.trim(),
        solution: code.trim(),
        language: lang,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="vm-challenge">
      <div className="vm-ch-head">
        <span className="vm-ch-week">Week #{ch.week}</span>
        <span className="vm-ch-diff" style={{ color: diffColor, borderColor: diffColor }}>
          {label}
        </span>
        <span className={`vm-ch-status ${isActive ? 'status-active' : 'status-done'}`}>
          {isActive ? '🔴 Live Now' : '✓ Completed'}
        </span>
      </div>
      <h2 className="vm-title">{ch.title}</h2>
      <p className="vm-desc">{ch.description}</p>
      {ch.tags && ch.tags.length > 0 && (
        <div className="vm-topics">
          {ch.tags.map((t) => <span key={t} className="vm-topic-pill">{t}</span>)}
        </div>
      )}
      {ch.winnerHandle && (
        <div className="vm-winner">
          🏆 Winner: <strong>{ch.winnerHandle}</strong>
        </div>
      )}

      {/* ── Submission form for active challenges ── */}
      {isActive && (
        status === 'success' ? (
          <div className="vm-success">
            <div className="vm-success-icon">✦</div>
            <div className="vm-success-title">Solution Submitted!</div>
            <p className="vm-success-sub">
              Your <strong>{langLabel}</strong> solution for Week #{ch.week} was received as <strong>{handle}</strong>.
              <br />Majd will review it this week.
            </p>
            <div className="vm-success-steps">
              <span className="vm-step-done">✓ Received</span>
              <span className="vm-step-sep">→</span>
              <span className="vm-step-pending">⏳ Review</span>
              <span className="vm-step-sep">→</span>
              <span className="vm-step-pending">🎬 Video</span>
            </div>
          </div>
        ) : (
          <form className="vm-submit-form" onSubmit={handleSubmit} noValidate>
            <div className="vm-submit-label">// submit_your_solution</div>
            <input
              className={`vm-input${status === 'error' && !handle.trim() ? ' vm-input-error' : ''}`}
              type="text"
              placeholder="@your_handle  (TikTok / Instagram / GitHub)"
              value={handle}
              onChange={(e) => { setHandle(e.target.value); setStatus('idle'); }}
              autoComplete="off"
              spellCheck={false}
            />
            <CodeEditor
              value={code}
              onChange={(v) => { setCode(v); setStatus('idle'); }}
              language={lang}
              onLanguageChange={setLang}
              hasError={status === 'error' && !code.trim()}
              minRows={10}
            />
            <div className="vm-submit-footer">
              {status === 'error' && (
                <span className="vm-error-msg">
                  ✗ {!handle.trim() ? 'Enter your handle.' : !code.trim() ? 'Write your solution.' : 'Something went wrong.'}
                </span>
              )}
              <button
                type="submit"
                className="ch-btn ch-btn-primary vm-submit-btn"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit Solution →'}
              </button>
            </div>
          </form>
        )
      )}

      <div className="vm-footer">
        {ch.link && !isActive && (
          <a href={ch.link} target="_blank" rel="noopener noreferrer" className="vm-link">
            View Solution ↗
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Meme Detail ── */
function MemeView({ meme }: { meme: MemeCard }) {
  return (
    <div className="vm-meme">
      <div className="vm-meme-img-wrap">
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="vm-meme-img"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
        />
      </div>
      <div className="vm-meme-body">
        <div className="vm-title">{meme.title}</div>
        {meme.category && <div className="vm-meme-cat">{meme.category}</div>}
      </div>
    </div>
  );
}
