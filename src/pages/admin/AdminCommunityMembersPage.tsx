import { useState, useEffect, FormEvent } from 'react';
import { communityMembersService } from '@features/community-members/services/communityMembers.service';
import type { CommunityMember } from '@types';

const EMPTY: Omit<CommunityMember, 'id'> = {
  name: '', githubUsername: '', bio: '', avatarUrl: '', role: '',
  skills: [], githubUrl: '', twitterUrl: '', linkedinUrl: '', websiteUrl: '',
  isFeatured: false, isPublished: true, sortOrder: 0,
};

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const BTN_PRIMARY = 'px-4 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors';
const BTN_GHOST   = 'px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors';

const TEXT_FIELDS: { key: keyof Omit<CommunityMember, 'id' | 'skills' | 'isFeatured' | 'isPublished' | 'sortOrder' | 'joinedAt' | 'createdAt' | 'updatedAt'>; label: string }[] = [
  { key: 'name',           label: 'Name' },
  { key: 'githubUsername', label: 'GitHub Username' },
  { key: 'role',           label: 'Role / Title' },
  { key: 'bio',            label: 'Bio' },
  { key: 'avatarUrl',      label: 'Avatar URL' },
  { key: 'githubUrl',      label: 'GitHub URL' },
  { key: 'twitterUrl',     label: 'Twitter URL' },
  { key: 'linkedinUrl',    label: 'LinkedIn URL' },
  { key: 'websiteUrl',     label: 'Website URL' },
];

const AdminCommunityMembersPage = () => {
  const [members, setMembers]   = useState<CommunityMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<CommunityMember | null>(null);
  const [form, setForm]         = useState<Omit<CommunityMember, 'id'>>(EMPTY);
  const [skillsRaw, setSkillsRaw] = useState('');
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => { setLoading(true); setMembers(await communityMembersService.getAllMembers()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setSkillsRaw(''); setShowForm(true); };
  const openEdit = (m: CommunityMember) => { setEditing(m); setForm({ ...m }); setSkillsRaw((m.skills ?? []).join(', ')); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, skills: skillsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) await communityMembersService.updateMember(editing.id, payload);
    else await communityMembersService.createMember(payload);
    setSaving(false);
    closeForm();
    await load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await communityMembersService.deleteMember(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">{members.length} members registered</p>
        </div>
        <button onClick={openNew} className={BTN_PRIMARY}>+ New Member</button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No members yet.</td></tr>
              )}
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className="w-9 h-9 rounded-full object-cover bg-gray-100" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-black shrink-0">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">@{m.githubUsername}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{m.role}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(m.skills ?? []).slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>
                      ))}
                      {(m.skills ?? []).length > 3 && <span className="text-xs text-gray-400">+{(m.skills ?? []).length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">{m.isFeatured ? <span className="text-amber-500">⭐</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${m.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(m)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                      <button onClick={() => setDeleteId(m.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
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
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Member' : 'New Member'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {TEXT_FIELDS.map(({ key, label }) => (
                <div key={key} className={key === 'bio' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                  <input
                    className={INPUT}
                    value={(form[key] as string) ?? ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={key === 'name'}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Skills (comma-separated)</label>
                <input className={INPUT} value={skillsRaw} onChange={e => setSkillsRaw(e.target.value)} />
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={!!form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={!!form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                  Published
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button type="button" onClick={closeForm} className={BTN_GHOST}>Cancel</button>
                <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Remove this member?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className={BTN_GHOST}>Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommunityMembersPage;
