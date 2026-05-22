import { useState, useEffect } from 'react';
import { newsletterService } from '@features/newsletter/services/newsletter.service';

interface Subscriber {
  id: string;
  email: string;
  created_at?: string;
  subscribed_at?: string;
}

const AdminNewsletterPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');

  useEffect(() => {
    // Timeout safety in case the query hangs (e.g., RLS policy issue)
    const timeout = setTimeout(() => setLoading(false), 8000);
    newsletterService.getSubscribers()
      .then(data => setSubscribers(data as Subscriber[]))
      .catch(console.error)
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => clearTimeout(timeout);
  }, []);

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const copyEmails = () => {
    navigator.clipboard.writeText(subscribers.map(s => s.email).join(', '));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subscribers.length} subscribers</p>
        </div>
        <button
          onClick={copyEmails}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Copy All Emails
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-12 text-center text-gray-400">
                  {search ? 'No matches found.' : 'No subscribers yet.'}
                </td></tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{s.email}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {(s.subscribed_at ?? s.created_at) ? new Date(s.subscribed_at ?? s.created_at!).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterPage;
