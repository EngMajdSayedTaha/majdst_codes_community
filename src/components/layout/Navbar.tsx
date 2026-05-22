import { useLocation, useNavigate } from 'react-router-dom';

interface NavLink {
  label: string;
  sectionId: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Dev Cards', sectionId: 'cards', path: '/dev-cards' },
  { label: 'Challenges', sectionId: 'challenges', path: '/challenges' },
  { label: 'Meme Lab', sectionId: 'memes', path: '/meme-lab' },
  { label: 'About', sectionId: 'about', path: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleNavClick = (link: NavLink) => {
    if (isHome) {
      document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(link.path);
    }
  };

  const handleLogoClick = () => navigate('/');

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
              href={isHome ? `#${link.sectionId}` : link.path}
              onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <button className="nav-cta" onClick={() => window.open('https://t.me/+xkErm_DI3-RkOTk8', '_blank', 'noopener,noreferrer')}>
        Join the Community
      </button>
    </nav>
  );
}
