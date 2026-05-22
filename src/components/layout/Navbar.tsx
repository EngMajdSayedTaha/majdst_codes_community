import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '@features/auth';

interface NavLink {
  label: string;
  sectionId: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Dev Cards',  sectionId: 'cards',      path: '/dev-cards' },
  { label: 'Challenges', sectionId: 'challenges', path: '/challenges' },
  { label: 'Community',  sectionId: 'community',  path: '/community' },
  { label: 'Meme Lab',   sectionId: 'memes',      path: '/meme-lab' },
  { label: 'About',      sectionId: 'about',      path: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user, loading, openAuthModal, signOut } = useUserAuth();

  const handleNavClick = (e: React.MouseEvent, link: NavLink) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => navigate('/');

  const userLabel = user
    ? (user.user_metadata?.display_name as string | undefined) ??
      user.email?.split('@')[0] ??
      'User'
    : null;

  return (
    <nav>
      <div className="nav-logo" onClick={handleLogoClick}>
        <img
          src="/images/profile.jpg"
          alt="Majd"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          className="profile-img w-10 h-10 inline-block mr-3"
        />
          majdst_codes
      </div>
      <ul className="nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.sectionId}>
            <a
              href={`/#${link.sectionId}`}
              onClick={(e) => handleNavClick(e, link)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-auth-group">
        {!loading && (
          user ? (
            <div className="nav-user">
              <span className="nav-user-label">{userLabel}</span>
              <button
                className="nav-signout-btn"
                onClick={() => signOut()}
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="nav-signin-btn"
              onClick={() => openAuthModal({ mode: 'login' })}
            >
              Sign In
            </button>
          )
        )}
        <button className="nav-cta" onClick={() => window.open('https://t.me/+xkErm_DI3-RkOTk8', '_blank', 'noopener,noreferrer')}>
          Join the Community
        </button>
      </div>
    </nav>
  );
}
