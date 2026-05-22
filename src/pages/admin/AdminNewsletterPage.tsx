import { useState, useEffect } from 'react';
import { newsletterService } from '@features/newsletter/services/newsletter.service';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt?: string;
}

const AdminNewsletterPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsletterService.getSubscribers().then(data => {
      setSubscribers(data as Subscriber[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <span className="text-sm text-gray-500">{subscribers.length} total</span>
      </div>

      {loading ? <p className="text-gray-500">Loading…</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-gray-400">{s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && <p className="text-center text-gray-400 py-8">No subscribers yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterPage;
