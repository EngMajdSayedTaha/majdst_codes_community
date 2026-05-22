// Main App Component
import { Router } from './router';
import { CookieConsent } from '@components/common/CookieConsent';
import { AuthProvider, AuthModal } from '@features/auth';
import '@styles/globals.css';
import '@styles/theme.css';
import '@styles/variables.css';

/**
 * App - Main application component
 * Sets up router, global auth, and cookie consent banner
 */
function App() {
  return (
    <AuthProvider>
      <Router />
      <AuthModal />
      <CookieConsent />
    </AuthProvider>
  );
}

export default App;