import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@lib/supabaseClient';

/**
 * AuthCallbackPage
 * Handles the redirect from Supabase after Google OAuth.
 *
 * Two modes:
 *  1. Popup mode  — sends postMessage to opener and closes.
 *  2. Redirect mode — navigates to / (fallback when popup was blocked).
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isPopup = Boolean(window.opener && window.opener !== window);

    // Supabase JS v2 automatically exchanges the code/token when getSession() is called
    supabase.auth.getSession().then(({ data, error }) => {
      if (isPopup) {
        if (error || !data.session) {
          window.opener?.postMessage(
            { type: 'OAUTH_ERROR', error: error?.message ?? 'Sign-in failed.' },
            window.location.origin,
          );
        } else {
          window.opener?.postMessage({ type: 'OAUTH_SUCCESS' }, window.location.origin);
        }
        window.close();
      } else {
        // Full-page redirect fallback
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: '3px solid var(--primary)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

