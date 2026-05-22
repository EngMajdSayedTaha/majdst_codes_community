import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useUserAuth } from '../context/AuthContext';

// ─── Google Icon ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useUserAuth();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Sync mode when parent changes it (e.g., "Sign Up" link from Navbar)
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isAuthModalOpen, authModalMode]);

  // Close on Escape key
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuthModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isAuthModalOpen, closeAuthModal]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isAuthModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isAuthModalOpen]);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setStatus('idle');
    setErrorMsg('');
    setShowPw(false);
  };

  const switchMode = useCallback((next: 'login' | 'register') => {
    setMode(next);
    resetFields();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    let err: string | null = null;

    if (mode === 'login') {
      err = await signInWithEmail(email, password);
    } else {
      if (!displayName.trim()) {
        setErrorMsg('Please enter your display name.');
        setStatus('error');
        return;
      }
      err = await signUpWithEmail(email, password, displayName.trim());
      if (!err) {
        setStatus('success');
        return;
      }
    }

    if (err) {
      // Sanitise Supabase messages for UX
      if (err.toLowerCase().includes('invalid login credentials')) {
        setErrorMsg('Incorrect email or password.');
      } else if (err.toLowerCase().includes('already registered')) {
        setErrorMsg('An account with this email already exists. Try signing in.');
      } else {
        setErrorMsg(err);
      }
      setStatus('error');
    }
  };

  const handleGoogle = async () => {
    setStatus('loading');
    setErrorMsg('');
    const err = await signInWithGoogle();
    if (err) {
      // Sanitise common Supabase provider errors
      if (err.toLowerCase().includes('provider is not enabled') || err.toLowerCase().includes('unsupported provider')) {
        setErrorMsg('Google sign-in is not configured yet. Please use email/password for now.');
      } else {
        setErrorMsg(err);
      }
      setStatus('error');
    } else {
      setStatus('idle');
    }
  };

  if (!isAuthModalOpen) return null;

  return createPortal(
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <div className="auth-modal-card">
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <span style={{ color: 'var(--primary)' }}>MAJDST</span>
            <span>.CODES</span>
          </div>
          <button
            className="auth-modal-close"
            onClick={closeAuthModal}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-modal-tabs">
          <button
            className={`auth-tab${mode === 'login' ? ' auth-tab-active' : ''}`}
            onClick={() => switchMode('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab${mode === 'register' ? ' auth-tab-active' : ''}`}
            onClick={() => switchMode('register')}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* Success state (register only) */}
        {status === 'success' ? (
          <div className="auth-modal-success">
            <div className="auth-success-icon">✓</div>
            <div className="auth-success-heading">Check your email</div>
            <p className="auth-success-sub">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <button className="auth-btn-primary" onClick={closeAuthModal}>
              Got it
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-modal-form" noValidate>
            {/* Google button */}
            <button
              type="button"
              className="auth-btn-google"
              onClick={handleGoogle}
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
            >
              {status === 'loading' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid var(--border2)', borderTopColor: 'var(--text)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Waiting for Google…
                </span>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Display name (register only) */}
            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-display-name">Display Name</label>
                <input
                  id="auth-display-name"
                  className="auth-input"
                  type="text"
                  placeholder="@your_handle"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="nickname"
                  required
                  disabled={status === 'loading'}
                />
              </div>
            )}

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete={mode === 'login' ? 'email' : 'email'}
                required
                disabled={status === 'loading'}
              />
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">
                Password
                {mode === 'register' && (
                  <span className="auth-label-hint">min. 8 characters</span>
                )}
              </label>
              <div className="auth-input-wrap">
                <input
                  id="auth-password"
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={8}
                  required
                  disabled={status === 'loading'}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && errorMsg && (
              <p className="auth-error" role="alert">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading'
                ? 'Please wait…'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>

            {/* Mode switch */}
            <p className="auth-switch">
              {mode === 'login' ? (
                <>
                  No account?{' '}
                  <button type="button" className="auth-switch-link" onClick={() => switchMode('register')}>
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have one?{' '}
                  <button type="button" className="auth-switch-link" onClick={() => switchMode('login')}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
