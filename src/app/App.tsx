// Main App Component
import { Router } from './router';
import { CookieConsent } from '@components/common/CookieConsent';
import '@styles/globals.css';
import '@styles/theme.css';
import '@styles/variables.css';

/**
 * App - Main application component
 * Sets up router, global styling, and cookie consent banner
 */
function App() {
  return (
    <>
      <Router />
      <CookieConsent />
    </>
  );
}

export default App;