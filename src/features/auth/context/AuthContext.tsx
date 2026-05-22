import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@lib/supabaseClient';
import { userProfileService } from '../services/userProfile.service';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /** Opens the login/register modal. Pass `returnPath` to redirect after sign-in. */
  openAuthModal: (opts?: { mode?: 'login' | 'register' }) => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<string | null>;
  /** Returns an error message string on failure, or null on success / popup closed. */
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Hydrate from existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // Close modal on successful sign-in
      if (s) {
        setIsAuthModalOpen(false);
        // Sync profile (upsert) — safe on every sign-in, not just first
        const u = s.user;
        const displayName =
          (u.user_metadata?.display_name as string | undefined) ??
          (u.user_metadata?.full_name as string | undefined) ??
          u.email?.split('@')[0] ??
          'Member';
        userProfileService.upsertProfile({
          id:          u.id,
          displayName,
          email:       u.email,
          avatarUrl:   u.user_metadata?.avatar_url as string | undefined,
        }).catch(() => { /* non-critical */ });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = useCallback((opts?: { mode?: 'login' | 'register' }) => {
    setAuthModalMode(opts?.mode ?? 'login');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    return error?.message ?? null;
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<string | null> => {
    // Generate the OAuth URL without redirecting (skipBrowserRedirect)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });

    if (error) return error.message;
    if (!data.url) return 'Could not generate Google sign-in URL.';

    // Try popup first — keeps the user on the page if there's an error
    const popup = window.open(
      data.url,
      'google-oauth',
      'width=520,height=650,scrollbars=yes,resizable=yes,left=' +
        Math.round(window.screenX + (window.outerWidth - 520) / 2) +
        ',top=' +
        Math.round(window.screenY + (window.outerHeight - 650) / 2),
    );

    if (!popup || popup.closed) {
      // Popup was blocked — fall back to full-page redirect
      window.location.href = data.url;
      return null;
    }

    // Wait for the popup to finish and send us a message
    return new Promise<string | null>((resolve) => {
      const onMessage = (event: MessageEvent<{ type: string; error?: string }>) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === 'OAUTH_SUCCESS') {
          cleanup();
          resolve(null);
        } else if (event.data?.type === 'OAUTH_ERROR') {
          cleanup();
          resolve(event.data.error ?? 'Authentication failed.');
        }
      };

      // Detect if user closes the popup without completing.
      // Wrap in try-catch: Google's COOP policy may block popup.closed access.
      const checkClosed = setInterval(() => {
        try {
          if (popup.closed) {
            cleanup();
            resolve(null); // silent — user dismissed
          }
        } catch {
          // COOP policy blocked the access — ignore and wait for postMessage
        }
      }, 800);

      const cleanup = () => {
        clearInterval(checkClosed);
        window.removeEventListener('message', onMessage);
      };

      window.addEventListener('message', onMessage);
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUserAuth must be used inside <AuthProvider>');
  return ctx;
}
