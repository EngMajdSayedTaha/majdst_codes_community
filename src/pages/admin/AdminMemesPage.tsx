import { useState, useEffect, FormEvent, useRef } from 'react';
import { memesService } from '@features/memes/services/memes.service';
import type { MemeCard } from '@types';

const AdminMemesPage = () => {
  const [memes, setMemes] = useState<MemeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const data = await memesService.getAllMemes();
    setMemes(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSaving(true);
    try {
      const imageUrl = await memesService.uploadImage(file);
      await memesService.createMeme({ title, imageUrl, category });
      setShowForm(false);
      setTitle('');
      setCategory('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await memesService.deleteMeme(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Memes</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90">+ Upload Meme</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 mb-8 grid gap-4 max-w-md">
          <h2 className="text-lg font-semibold">Upload Meme</h2>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={category} onChange={e => setCategory(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
            <input ref={fileRef} required type="file" accept="image/*" className="w-full text-sm" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving || !file} className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Uploading…' : 'Upload'}</button>
          </div>
        </form>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <p className="font-medium mb-4">Delete this meme? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-500">Loading…</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {memes.map(m => (
            <div key={m.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{m.title}</p>
                <p className="text-xs text-gray-400">{m.category}</p>
                <button onClick={() => setDeleteId(m.id)} className="mt-2 text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMemesPage;
