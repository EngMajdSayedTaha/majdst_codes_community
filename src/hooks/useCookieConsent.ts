import { useState, useEffect, useCallback } from 'react';
import type { CookieConsent } from '@types';

const COOKIE_CONSENT_KEY = 'majdst_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

/**
 * Default cookie preferences
 * Necessary cookies are always enabled
 */
const DEFAULT_PREFERENCES: CookieConsent = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
  version: COOKIE_CONSENT_VERSION,
};

/**
 * Hook to manage cookie consent preferences
 * Persists user preferences to localStorage
 * Provides methods to update and reset preferences
 */
export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  /**
   * Initialize consent from localStorage
   */
  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent) as CookieConsent;
        setConsent(parsed);
        setShowBanner(false);
      } catch (error) {
        console.warn('Failed to parse stored cookie consent:', error);
        setConsent(DEFAULT_PREFERENCES);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  /**
   * Save consent preferences to localStorage
   */
  const saveConsent = useCallback((preferences: Partial<CookieConsent>) => {
    const updated: CookieConsent = {
      ...DEFAULT_PREFERENCES,
      ...preferences,
      timestamp: Date.now(),
      version: COOKIE_CONSENT_VERSION,
    };

    setConsent(updated);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated));
    setShowBanner(false);
  }, []);

  /**
   * Accept all cookies
   */
  const acceptAll = useCallback(() => {
    saveConsent({
      analytics: true,
      marketing: true,
      functional: true,
      necessary: true,
    });
  }, [saveConsent]);

  /**
   * Accept only necessary cookies
   */
  const acceptNecessary = useCallback(() => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  }, [saveConsent]);

  /**
   * Custom consent preferences
   */
  const updateConsent = useCallback((preferences: Partial<CookieConsent>) => {
    saveConsent({
      ...consent,
      ...preferences,
      necessary: true, // Necessary is always true
    });
  }, [consent, saveConsent]);

  /**
   * Reset consent and show banner again
   */
  const resetConsent = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
  }, []);

  /**
   * Check if a specific cookie category is allowed
   */
  const isConsentGiven = useCallback((category: keyof Omit<CookieConsent, 'timestamp' | 'version'>) => {
    if (category === 'necessary') return true; // Always true
    return consent?.[category] ?? false;
  }, [consent]);

  return {
    consent,
    showBanner,
    acceptAll,
    acceptNecessary,
    updateConsent,
    resetConsent,
    isConsentGiven,
    saveConsent,
  };
};
