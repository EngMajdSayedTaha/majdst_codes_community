import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/dev-cards', label: '📚 Dev Cards' },
  { to: '/admin/community', label: '👥 Community' },
  { to: '/admin/challenges', label: '🏆 Challenges' },
  { to: '/admin/submissions', label: '📝 Submissions' },
  { to: '/admin/memes', label: '😂 Memes' },
  { to: '/admin/newsletter', label: '📬 Newsletter' },
  { to: '/admin/settings', label: '⚙️ Settings' },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <p className="text-sm font-bold text-primary">majdst.codes</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
