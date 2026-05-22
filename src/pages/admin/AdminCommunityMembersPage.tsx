import { useState, useEffect, FormEvent } from 'react';
import { communityMembersService } from '@features/community-members/services/communityMembers.service';
import type { CommunityMember } from '@types';

const EMPTY: Omit<CommunityMember, 'id'> = {
  name: '',
  githubUsername: '',
  bio: '',
  avatarUrl: '',
  role: '',
  skills: [],
  githubUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  isFeatured: false,
  isPublished: true,
  sortOrder: 0,
};

const AdminCommunityMembersPage = () => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CommunityMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<CommunityMember, 'id'>>(EMPTY);
  const [skillsRaw, setSkillsRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await communityMembersService.getAllMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setSkillsRaw(''); setShowForm(true); };
  const openEdit = (m: CommunityMember) => { setEditing(m); setForm({ ...m }); setSkillsRaw((m.skills ?? []).join(', ')); setShowForm(true); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, skills: skillsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) {
      await communityMembersService.updateMember(editing.id, payload);
    } else {
      await communityMembersService.createMember(payload);
    }
    setSaving(false);
    setShowForm(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await communityMembersService.deleteMember(deleteId);
    setDeleteId(null);
    await load();
  };

  const TEXT_FIELDS: (keyof Omit<CommunityMember, 'id' | 'skills' | 'isFeatured' | 'isPublished' | 'sortOrder' | 'joinedAt' | 'createdAt' | 'updatedAt'>)[] = [
    'name', 'githubUsername', 'bio', 'avatarUrl', 'role', 'githubUrl', 'twitterUrl', 'linkedinUrl', 'websiteUrl',
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Members</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90">+ New Member</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-semibold">{editing ? 'Edit Member' : 'New Member'}</h2>
          {TEXT_FIELDS.map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field}</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={(form[field] as string) ?? ''}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                required={field === 'name'}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Skills (comma-separated)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={skillsRaw} onChange={e => setSkillsRaw(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} /> Featured</label>
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
            <p className="font-medium mb-4">Delete this member? This cannot be undone.</p>
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
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Featured</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-gray-500">{m.role}</td>
                  <td className="px-4 py-3">{m.isFeatured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3">{m.isPublished ? '✅' : '❌'}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(m)} className="text-primary text-xs hover:underline">Edit</button>
                    <button onClick={() => setDeleteId(m.id)} className="text-red-500 text-xs hover:underline">Delete</button>
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

export default AdminCommunityMembersPage;
