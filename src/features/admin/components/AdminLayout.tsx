import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const NAV_SECTIONS: {
  label: string;
  items: { to: string; label: string; icon: React.ReactNode; end?: boolean }[];
}[] = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/admin', label: 'Dashboard', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ), end: true },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { to: '/admin/dev-cards', label: 'Dev Cards', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      )},
      { to: '/admin/community', label: 'Community', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )},
      { to: '/admin/challenges', label: 'Challenges', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      )},
      { to: '/admin/submissions', label: 'Submissions', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      )},
      { to: '/admin/memes', label: 'Meme Lab', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      )},
    ],
  },
  {
    label: 'AUDIENCE',
    items: [
      { to: '/admin/newsletter', label: 'Newsletter', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )},
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )},
    ],
  },
];

// Flat map for finding the current page label
const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items);

const AdminLayout = () => {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const email = session?.user?.email ?? 'Admin';
  const initials = email.slice(0, 2).toUpperCase();

  const currentPage = ALL_NAV_ITEMS.find(item =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label ?? 'Admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px', flexShrink: 0,
        backgroundColor: '#0d0d1a',
        borderRight: '1px solid #1e1e38',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e1e38' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              backgroundColor: '#F9E400',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0d0d1a">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1, color: '#fff', margin: 0 }}>
              <span style={{ color: '#F9E400' }}>majdst</span>.codes
            </p>
          </div>
          <p style={{ fontSize: '10px', color: '#4b5563', fontFamily: 'monospace', letterSpacing: '0.1em', margin: 0, paddingLeft: '36px' }}>
            ADMIN PANEL
          </p>
        </div>

        {/* Nav sections */}
        <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: '4px' }}>
              <p style={{
                fontSize: '10px', fontWeight: 600, color: '#374151',
                letterSpacing: '0.08em', fontFamily: 'monospace',
                padding: '8px 12px 4px', margin: 0,
              }}>
                {section.label}
              </p>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : undefined}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', borderRadius: '8px',
                    fontSize: '13.5px', fontWeight: 500,
                    textDecoration: 'none',
                    marginBottom: '1px',
                    transition: 'all 0.15s',
                    backgroundColor: isActive ? '#F9E400' : 'transparent',
                    color: isActive ? '#0d0d1a' : '#9ca3af',
                  })}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    if (!el.style.backgroundColor.includes('F9E400')) {
                      el.style.backgroundColor = '#141428';
                      el.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    if (!el.style.backgroundColor.includes('F9E400')) {
                      el.style.backgroundColor = 'transparent';
                      el.style.color = '#9ca3af';
                    }
                  }}
                >
                  <span style={{ flexShrink: 0, opacity: 0.9 }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* User / Sign-out */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #1e1e38' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px',
            backgroundColor: '#141428', marginBottom: '4px',
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              backgroundColor: '#F9E400',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: '#0d0d1a', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {email}
              </p>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', background: 'transparent',
              fontSize: '13px', color: '#6b7280', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#141428'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#f9fafb' }}>
        {/* Top header bar */}
        <header style={{
          height: '56px', borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>majdst.codes</span>
            <span style={{ fontSize: '12px', color: '#d1d5db' }}>/</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{currentPage}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              backgroundColor: '#F9E400',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: '#0d0d1a',
            }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
