import { useState, useEffect, FormEvent } from 'react';
import { devCardsService } from '@features/dev-cards/services/devCards.service';
import type { DevCard } from '@types';

const EMPTY: Omit<DevCard, 'id'> = {
  title: '', description: '', difficulty: 'beginner', learningTime: '',
  topics: [], link: '', icon: '', tagKey: '', funFact: '',
  savesCount: 0, isPublished: true, sortOrder: 0,
};

const DIFF_BADGE: Record<string, string> = {
  beginner:     'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced:     'bg-red-100 text-red-700',
};

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const BTN_PRIMARY = 'px-4 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors';
const BTN_GHOST   = 'px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors';

const AdminDevCardsPage = () => {
  const [cards, setCards]       = useState<DevCard[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<DevCard | null>(null);
  const [form, setForm]         = useState<Omit<DevCard, 'id'>>(EMPTY);
  const [topicsRaw, setTopicsRaw] = useState('');
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setCards(await devCardsService.getAllDevCards());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setTopicsRaw(''); setShowForm(true); };
  const openEdit = (c: DevCard) => { setEditing(c); setForm({ ...c }); setTopicsRaw(c.topics.join(', ')); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, topics: topicsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) await devCardsService.updateDevCard(editing.id, payload);
    else await devCardsService.createDevCard(payload);
    setSaving(false);
    closeForm();
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dev Cards</h1>
          <p className="text-sm text-gray-500 mt-0.5">{cards.length} total cards</p>
        </div>
        <button onClick={openNew} className={BTN_PRIMARY}>+ New Card</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tag</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Saves</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cards.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No cards yet. Add your first one!</td></tr>
              )}
              {cards.map(card => (
                <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{card.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{card.learningTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-mono text-xs">{card.tagKey}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${DIFF_BADGE[card.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                      {card.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{card.savesCount ?? 0}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${card.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {card.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(card)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                      <button onClick={() => setDeleteId(card.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
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
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Dev Card' : 'New Dev Card'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {(['title', 'description', 'link', 'icon', 'tagKey', 'funFact', 'learningTime'] as const).map(field => (
                <div key={field} className={field === 'description' || field === 'funFact' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide capitalize">{field}</label>
                  <input
                    className={INPUT}
                    value={(form[field] as string) ?? ''}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    required={field === 'title' || field === 'description'}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Topics (comma-separated)</label>
                <input className={INPUT} value={topicsRaw} onChange={e => setTopicsRaw(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Difficulty</label>
                <select className={INPUT} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as DevCard['difficulty'] }))}>
                  {['beginner', 'intermediate', 'advanced'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" checked={!!form.isPublished}
                    onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                  Published
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Sort order:</span>
                  <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-sm" value={form.sortOrder ?? 0}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button type="button" onClick={closeForm} className={BTN_GHOST}>Cancel</button>
                <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Card'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete this card?</h3>
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

export default AdminDevCardsPage;
