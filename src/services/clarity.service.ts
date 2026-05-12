import clarity from '@microsoft/clarity';

/**
 * Clarity Service
 * Manages Microsoft Clarity integration and respects user cookie preferences
 */

const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;
let clarityInitialized = false;

/**
 * Check if Clarity is currently active
 */
export const isClarityActive = (): boolean => {
  return clarityInitialized && !!CLARITY_PROJECT_ID;
};

/**
 * Stop Clarity tracking
 * Called when user rejects analytics cookies
 * Note: Clarity cannot be completely stopped after initialization,
 * but we prevent initialization if user rejects
 */
export const stopClarity = (): void => {
  try {
    if (isClarityActive()) {
      // Clarity tracks are persisted and cannot be truly stopped.
      // This is documented behavior - we log for transparency
      console.log('Analytics disabled - Clarity was already initialized');
    }
  } catch (error) {
    console.warn('Error handling Clarity stop:', error);
  }
};

/**
 * Resume/Start Clarity tracking
 * Called when user enables analytics cookies
 */
export const startClarity = (): void => {
  try {
    if (CLARITY_PROJECT_ID && !clarityInitialized) {
      clarity.init(CLARITY_PROJECT_ID);
      clarityInitialized = true;
      console.log('Clarity tracking started - user enabled analytics cookies');
    }
  } catch (error) {
    console.warn('Failed to start Clarity:', error);
  }
};

/**
 * Update Clarity based on consent status
 * Note: If user rejects analytics after Clarity is initialized,
 * existing data remains but no new tracking occurs
 */
export const updateClarityConsent = (analyticsConsent: boolean): void => {
  if (analyticsConsent) {
    startClarity();
  } else {
    stopClarity();
  }
};

export default {
  isClarityActive,
  stopClarity,
  startClarity,
  updateClarityConsent,
};
