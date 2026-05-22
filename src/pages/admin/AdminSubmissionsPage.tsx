import { useState, useEffect } from 'react';
import { challengesService } from '@features/challenges/services/challenges.service';
import type { ChallengeSubmission } from '@types';

const STATUS_BADGE: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  reviewed: 'bg-blue-100 text-blue-700',
  winner:   'bg-yellow-100 text-yellow-700',
};

const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [updating, setUpdating]       = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setSubmissions(await challengesService.getSubmissions());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: ChallengeSubmission['status']) => {
    setUpdating(id);
    await challengesService.updateSubmissionStatus(id, status);
    setUpdating(null);
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{submissions.length} total submissions</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Pending
          <span className="ml-3 w-2 h-2 rounded-full bg-blue-400 inline-block" /> Reviewed
          <span className="ml-3 w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Winner
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Handle</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Solution</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No submissions yet.</td></tr>
              )}
              {submissions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900 font-mono">{s.handle}</span>
                  </td>
                  <td className="px-5 py-4">
                    {s.solution ? (
                      <a href={s.solution} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-xs truncate block max-w-xs">
                        {s.solution}
                      </a>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={s.status}
                      disabled={updating === s.id}
                      onChange={e => updateStatus(s.id, e.target.value as ChallengeSubmission['status'])}
                      className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:opacity-50"
                    >
                      <option value="pending">pending</option>
                      <option value="reviewed">reviewed</option>
                      <option value="winner">winner</option>
                    </select>
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

export default AdminSubmissionsPage;
