import React, { useState } from 'react';
import { useCookieConsent } from '@hooks/useCookieConsent';
import { updateClarityConsent } from '@services/clarity.service';
import '@styles/cookie-consent.css';

/**
 * CookieConsent Component
 * Displays a popup banner asking users for cookie consent
 * Follows GDPR best practices and accessibility standards
 */
export const CookieConsent: React.FC = () => {
  const { showBanner, acceptAll, acceptNecessary, updateConsent, consent } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
    functional: consent?.functional ?? true,
  });

  if (!showBanner) {
    return null;
  }

  const handleToggle = (category: 'analytics' | 'marketing' | 'functional') => {
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSavePreferences = () => {
    updateConsent({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      functional: preferences.functional,
      necessary: true,
    });
    // Update Clarity based on analytics consent
    updateClarityConsent(preferences.analytics);
    setShowDetails(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    // Update Clarity - accept all means analytics is enabled
    updateClarityConsent(true);
  };

  const handleAcceptNecessary = () => {
    acceptNecessary();
    // Update Clarity - necessary only means analytics is disabled
    updateClarityConsent(false);
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      <div
        className="cookie-consent-banner"
        role="alertdialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-description"
      >
        <div className="cookie-consent-container">
          {!showDetails ? (
            <>
              {/* Main Banner Content */}
              <div className="cookie-consent-content">
                <div className="cookie-consent-text">
                  <h2 id="cookie-title" className="cookie-consent-title">
                    🍪 Cookie Preferences
                  </h2>
                  <p id="cookie-description" className="cookie-consent-description">
                    We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
                    Your privacy is important to us. You can customize your preferences or accept all.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="cookie-consent-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleAcceptNecessary}
                    aria-label="Accept only necessary cookies"
                  >
                    Necessary Only
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowDetails(true)}
                    aria-label="Customize cookie preferences"
                  >
                    Customize
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAcceptAll}
                    aria-label="Accept all cookies"
                  >
                    Accept All
                  </button>
                </div>

                {/* Links */}
                <div className="cookie-consent-links">
                  <a href="/privacy" className="cookie-link" aria-label="View privacy policy">
                    Privacy Policy
                  </a>
                  <span className="cookie-link-separator">•</span>
                  <a href="/cookies" className="cookie-link" aria-label="View cookie policy">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Detailed Settings */}
              <div className="cookie-consent-details">
                <h2 className="cookie-consent-title">Cookie Settings</h2>
                <p className="cookie-consent-subtitle">
                  Choose which cookies we can use to improve your experience.
                </p>

                {/* Cookie Categories */}
                <div className="cookie-categories">
                  {/* Necessary Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h3 className="cookie-category-name">Necessary Cookies</h3>
                        <p className="cookie-category-description">
                          Required for basic site functionality. Always enabled.
                        </p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="necessary-cookies"
                          checked={true}
                          disabled
                          aria-label="Necessary cookies toggle"
                        />
                        <label htmlFor="necessary-cookies" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h3 className="cookie-category-name">Functional Cookies</h3>
                        <p className="cookie-category-description">
                          Enable enhanced functionality and personalization based on your preferences.
                        </p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="functional-cookies"
                          checked={preferences.functional}
                          onChange={() => handleToggle('functional')}
                          aria-label="Functional cookies toggle"
                        />
                        <label htmlFor="functional-cookies" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h3 className="cookie-category-name">Analytics Cookies</h3>
                        <p className="cookie-category-description">
                          Help us understand how you use our site and improve your experience. Includes Microsoft Clarity for session recordings.
                        </p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="analytics-cookies"
                          checked={preferences.analytics}
                          onChange={() => handleToggle('analytics')}
                          aria-label="Analytics cookies toggle"
                        />
                        <label htmlFor="analytics-cookies" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h3 className="cookie-category-name">Marketing Cookies</h3>
                        <p className="cookie-category-description">
                          Used for targeted advertising and tracking marketing campaign performance.
                        </p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="marketing-cookies"
                          checked={preferences.marketing}
                          onChange={() => handleToggle('marketing')}
                          aria-label="Marketing cookies toggle"
                        />
                        <label htmlFor="marketing-cookies" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Action Buttons */}
                <div className="cookie-details-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDetails(false)}
                    aria-label="Go back to main cookie preferences"
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSavePreferences}
                    aria-label="Save your cookie preferences"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="cookie-consent-backdrop"
        onClick={handleAcceptNecessary}
        role="presentation"
      ></div>
    </>
  );
};

export default CookieConsent;
