import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/admin/hooks/useAuth';

const AdminLoginPage = () => {
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError('Invalid email or password. Please try again.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#080810', fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(249,228,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,228,0,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            <span style={{ color: '#F9E400' }}>MAJDST</span>
            <span className="text-white">.CODES</span>
          </p>
          <p className="text-xs text-gray-500 mt-2 font-mono tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#141428] border border-[#1e1e38] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#141428] border border-[#1e1e38] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-900/30 border border-red-800/50 rounded-xl">
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 font-bold text-sm rounded-xl transition-all duration-150 disabled:opacity-50"
              style={{ background: '#F9E400', color: '#000' }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          majdst.codes admin panel · restricted access
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
