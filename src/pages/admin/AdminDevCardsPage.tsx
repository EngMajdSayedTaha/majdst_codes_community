import { useState, useEffect, FormEvent } from 'react';
import { devCardsService } from '@features/dev-cards/services/devCards.service';
import type { DevCard } from '@types';

const EMPTY: Omit<DevCard, 'id'> = {
  title: '',
  description: '',
  difficulty: 'beginner',
  learningTime: '',
  topics: [],
  link: '',
  icon: '',
  tagKey: '',
  funFact: '',
  savesCount: 0,
  isPublished: true,
  sortOrder: 0,
};

const AdminDevCardsPage = () => {
  const [cards, setCards] = useState<DevCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DevCard | null>(null);
  const [form, setForm] = useState<Omit<DevCard, 'id'>>(EMPTY);
  const [topicsRaw, setTopicsRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await devCardsService.getAllDevCards();
    setCards(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setTopicsRaw('');
  };

  const openEdit = (card: DevCard) => {
    setEditing(card);
    setForm({ ...card });
    setTopicsRaw(card.topics.join(', '));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, topics: topicsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) {
      await devCardsService.updateDevCard(editing.id, payload);
    } else {
      await devCardsService.createDevCard(payload);
    }
    setSaving(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await devCardsService.deleteDevCard(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dev Cards</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90">+ New Card</button>
      </div>

      {/* Form */}
      {(editing !== undefined) && (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-semibold">{editing ? 'Edit Card' : 'New Card'}</h2>
          {(['title', 'description', 'link', 'icon', 'tagKey', 'funFact'] as const).map(field => (
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Topics (comma-separated)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={topicsRaw}
              onChange={e => setTopicsRaw(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.difficulty}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as DevCard['difficulty'] }))}
            >
              {['beginner', 'intermediate', 'advanced'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.isPublished ?? true} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
            <label htmlFor="published" className="text-sm text-gray-700">Published</label>
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <p className="text-gray-800 font-medium mb-4">Delete this card? This cannot be undone.</p>
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
                <th className="px-4 py-3 text-left">Tag</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {cards.map(card => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{card.title}</td>
                  <td className="px-4 py-3 text-gray-500">{card.tagKey}</td>
                  <td className="px-4 py-3 text-gray-500">{card.difficulty}</td>
                  <td className="px-4 py-3">{card.isPublished ? '✅' : '❌'}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(card)} className="text-primary text-xs font-medium hover:underline">Edit</button>
                    <button onClick={() => setDeleteId(card.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
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

export default AdminDevCardsPage;
