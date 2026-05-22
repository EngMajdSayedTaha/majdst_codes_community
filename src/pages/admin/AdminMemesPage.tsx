import { useState, useEffect, FormEvent, useRef } from 'react';
import { memesService } from '@features/memes/services/memes.service';
import type { MemeCard } from '@types';

const AdminMemesPage = () => {
  const [memes, setMemes]       = useState<MemeCard[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<MemeCard | null>(null);
  const [title, setTitle]       = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => { setLoading(true); setMemes(await memesService.getAllMemes()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setTitle(''); setCategory(''); setFile(null); setPreview(null); setShowForm(true); };
  const openEdit = (m: MemeCard) => { setEditing(m); setTitle(m.title); setCategory(m.category ?? ''); setFile(null); setPreview(m.imageUrl); setShowForm(true); };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setTitle('');
    setCategory('');
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        // Edit mode: optionally replace image, always update title/category
        let imageUrl = editing.imageUrl;
        if (file) imageUrl = await memesService.uploadImage(file);
        await memesService.updateMeme(editing.id, { title, category, imageUrl });
      } else {
        if (!file) return;
        const imageUrl = await memesService.uploadImage(file);
        await memesService.createMeme({ title, imageUrl, category });
      }
      closeForm();
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meme Lab</h1>
          <p className="text-sm text-gray-500 mt-0.5">{memes.length} memes in the lab</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
          + Upload Meme
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : memes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-4xl mb-3">😶</p>
          <p className="text-gray-500 text-sm">No memes yet. Upload the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memes.map(m => (
            <div key={m.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>
                {m.category && <p className="text-xs text-gray-400 mt-0.5">{m.category}</p>}
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => openEdit(m)}
                    className="text-xs text-primary hover:text-yellow-500 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(m.id)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Meme' : 'Upload Meme'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Preview */}
              {preview && (
                <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img src={preview} alt="preview" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  {editing ? 'Replace Image (optional)' : 'Image'}
                </label>
                <input
                  ref={fileRef}
                  required={!editing}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-black hover:file:bg-yellow-300 file:cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. When the prod server is down"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. debugging, git, css"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button type="button" onClick={closeForm} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  type="submit"
                  disabled={saving || (!editing && !file)}
                  className="px-4 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                >
                  {saving ? (editing ? 'Saving…' : 'Uploading…') : (editing ? 'Save Changes' : 'Upload')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete this meme?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove it. Cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemesPage;
