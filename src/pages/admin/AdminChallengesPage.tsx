import { useState, useEffect, FormEvent } from 'react';
import { challengesService } from '@features/challenges/services/challenges.service';
import type { Challenge } from '@types';

const EMPTY: Omit<Challenge, 'id'> = {
  title: '',
  description: '',
  difficulty: 'medium',
  reward: 0,
  featured: false,
  week: 1,
  status: 'active',
  date: new Date().toISOString(),
  link: '',
  tags: [],
  winnerHandle: '',
  isPublished: true,
};

const AdminChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Challenge | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Challenge, 'id'>>(EMPTY);
  const [tagsRaw, setTagsRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await challengesService.getAllChallenges();
    setChallenges(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setTagsRaw(''); setShowForm(true); };
  const openEdit = (c: Challenge) => { setEditing(c); setForm({ ...c }); setTagsRaw((c.tags ?? []).join(', ')); setShowForm(true); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: tagsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) {
      await challengesService.updateChallenge(editing.id, payload);
    } else {
      await challengesService.createChallenge(payload);
    }
    setSaving(false);
    setShowForm(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90">+ New Challenge</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-semibold">{editing ? 'Edit Challenge' : 'New Challenge'}</h2>
          {(['title', 'description', 'link', 'winnerHandle'] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field}</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={(form[field] as string) ?? ''}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                required={field === 'title' || field === 'description'}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Challenge['difficulty'] }))}>
              {['easy', 'medium', 'hard'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Challenge['status'] }))}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Week #</label>
            <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.week ?? 1} onChange={e => setForm(f => ({ ...f, week: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reward ($)</label>
            <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.reward ?? 0} onChange={e => setForm(f => ({ ...f, reward: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} /> Published</label>
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <p className="font-medium mb-4">Delete this challenge? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-500">Loading…</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Week</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {challenges.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 text-gray-500">#{c.week}</td>
                  <td className="px-4 py-3 text-gray-500">{c.difficulty}</td>
                  <td className="px-4 py-3 text-gray-500">{c.status}</td>
                  <td className="px-4 py-3">{c.featured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(c)} className="text-primary text-xs hover:underline">Edit</button>
                    <button onClick={() => setDeleteId(c.id)} className="text-red-500 text-xs hover:underline">Delete</button>
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

export default AdminChallengesPage;
