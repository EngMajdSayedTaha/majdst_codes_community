import { useState, useEffect } from 'react';
import { challengesService } from '@features/challenges/services/challenges.service';
import type { ChallengeSubmission } from '@types';

const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await challengesService.getSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: ChallengeSubmission['status']) => {
    await challengesService.updateSubmissionStatus(id, status);
    await load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submissions</h1>
      {loading ? <p className="text-gray-500">Loading…</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Handle</th>
                <th className="px-4 py-3 text-left">Challenge ID</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.handle}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{s.challengeId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.status === 'winner' ? 'bg-yellow-100 text-yellow-800' :
                      s.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={e => updateStatus(s.id, e.target.value as ChallengeSubmission['status'])}
                      className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
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
          {submissions.length === 0 && <p className="text-center text-gray-400 py-8">No submissions yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminSubmissionsPage;
