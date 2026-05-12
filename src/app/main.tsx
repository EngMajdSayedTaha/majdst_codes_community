// Entry point for React application
import React from 'react';
import ReactDOM from 'react-dom/client';
import clarity from '@microsoft/clarity';
import App from './App';
import '../styles/variables.css';
import '../styles/globals.css';
import '../styles/theme.css';

/**
 * Initialize Microsoft Clarity respecting user cookie preferences
 * Clarity is only initialized if:
 * 1. User has given analytics consent, OR
 * 2. User hasn't seen the cookie banner yet (presumed consent)
 */
const initializeClarity = () => {
  const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  if (!clarityProjectId) {
    console.warn('[Clarity] VITE_CLARITY_PROJECT_ID is not set. Add it to Vercel → Settings → Environment Variables and redeploy.');
    return;
  }

  const COOKIE_CONSENT_KEY = 'majdst_cookie_consent';
  const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

  if (storedConsent) {
    try {
      const consent = JSON.parse(storedConsent);
      // Only init Clarity if analytics cookies are allowed
      if (consent.analytics) {
        clarity.init(clarityProjectId);
      }
    } catch (error) {
      console.warn('Failed to parse stored cookie consent:', error);
      // Initialize Clarity on parse error (graceful fallback)
      clarity.init(clarityProjectId);
    }
  } else {
    // No consent stored yet - initialize Clarity with presumed consent
    // This will be stopped if user only accepts necessary cookies
    clarity.init(clarityProjectId);
  }
};

initializeClarity();

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found. Make sure index.html has an element with id="root"');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);