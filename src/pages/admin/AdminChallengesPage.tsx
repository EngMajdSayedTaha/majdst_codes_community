import { useState, useEffect, FormEvent } from 'react';
import { challengesService } from '@features/challenges/services/challenges.service';
import type { Challenge } from '@types';

const EMPTY: Omit<Challenge, 'id'> = {
  title: '', description: '', difficulty: 'medium', reward: 0,
  featured: false, week: 1, status: 'active',
  date: new Date().toISOString(), link: '', tags: [], winnerHandle: '', isPublished: true,
};

const DIFF: Record<string, string> = {
  easy:   'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard:   'bg-red-100 text-red-700',
};
const STATUS: Record<string, string> = {
  active:    'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  upcoming:  'bg-purple-100 text-purple-700',
};

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const BTN_PRIMARY = 'px-4 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors';
const BTN_GHOST   = 'px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors';

const AdminChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Challenge | null>(null);
  const [form, setForm]             = useState<Omit<Challenge, 'id'>>(EMPTY);
  const [tagsRaw, setTagsRaw]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);

  const load = async () => { setLoading(true); setChallenges(await challengesService.getAllChallenges()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setTagsRaw(''); setShowForm(true); };
  const openEdit = (c: Challenge) => { setEditing(c); setForm({ ...c }); setTagsRaw((c.tags ?? []).join(', ')); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: tagsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) await challengesService.updateChallenge(editing.id, payload);
    else await challengesService.createChallenge(payload);
    setSaving(false);
    closeForm();
    await load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await challengesService.deleteChallenge(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
          <p className="text-sm text-gray-500 mt-0.5">{challenges.length} total challenges</p>
        </div>
        <button onClick={openNew} className={BTN_PRIMARY}>+ New Challenge</button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Challenge</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Week</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reward</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {challenges.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No challenges yet.</td></tr>
              )}
              {challenges.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{c.title}</p>
                    {c.winnerHandle && <p className="text-xs text-amber-600 mt-0.5">🏆 {c.winnerHandle}</p>}
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-mono">#{c.week}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${DIFF[c.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS[c.status as string] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-medium">${c.reward}</td>
                  <td className="px-5 py-4 text-center">{c.featured ? <span className="text-amber-500">⭐</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(c)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                      <button onClick={() => setDeleteId(c.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal Form ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Challenge' : 'New Challenge'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title</label>
                <input className={INPUT} required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea className={`${INPUT} resize-none`} rows={3} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Link</label>
                <input className={INPUT} value={form.link ?? ''} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Winner Handle</label>
                <input className={INPUT} value={form.winnerHandle ?? ''} onChange={e => setForm(f => ({ ...f, winnerHandle: e.target.value }))} placeholder="@username" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tags (comma-sep)</label>
                <input className={INPUT} value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Difficulty</label>
                <select className={INPUT} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Challenge['difficulty'] }))}>
                  {['easy', 'medium', 'hard'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
                <select className={INPUT} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Challenge['status'] }))}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Week #</label>
                <input type="number" className={INPUT} value={form.week ?? 1} onChange={e => setForm(f => ({ ...f, week: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Reward ($)</label>
                <input type="number" className={INPUT} value={form.reward ?? 0} onChange={e => setForm(f => ({ ...f, reward: Number(e.target.value) }))} />
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={!!form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                  Published
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button type="button" onClick={closeForm} className={BTN_GHOST}>Cancel</button>
                <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Challenge'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete this challenge?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className={BTN_GHOST}>Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChallengesPage;
