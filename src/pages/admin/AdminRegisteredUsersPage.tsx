import { useState, useEffect } from 'react';
import { userProfileService, type UserProfile } from '@features/auth/services/userProfile.service';

const BTN_PRIMARY = 'px-3 py-1.5 bg-primary text-black text-xs font-semibold rounded-lg hover:bg-yellow-300 transition-colors';
const BTN_GHOST   = 'px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors';
const BTN_DANGER  = 'px-3 py-1.5 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50 transition-colors';

type Filter = 'all' | 'pending' | 'approved' | 'featured';

const AdminRegisteredUsersPage = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Filter>('all');
  const [search, setSearch]     = useState('');
  const [editing, setEditing]   = useState<UserProfile | null>(null);
  const [editBio, setEditBio]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setProfiles(await userProfileService.getAllProfiles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = profiles.filter((p) => {
    const matchSearch =
      !search ||
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (p.email ?? '').toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'all'      ? true :
      filter === 'pending'  ? !p.isApproved :
      filter === 'approved' ? p.isApproved :
      filter === 'featured' ? p.isFeatured :
      true;

    return matchSearch && matchFilter;
  });

  const toggle = async (id: string, key: 'isApproved' | 'isFeatured', value: boolean) => {
    setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, [key]: value } : p));
    await userProfileService.updateProfile(id, { [key]: value });
  };

  const openEdit = (p: UserProfile) => { setEditing(p); setEditBio(p.bio); };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    await userProfileService.updateProfile(editing.id, { bio: editBio });
    setProfiles((prev) => prev.map((p) => p.id === editing.id ? { ...p, bio: editBio } : p));
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await userProfileService.deleteProfile(deleteId);
    setProfiles((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const counts = {
    all:      profiles.length,
    pending:  profiles.filter((p) => !p.isApproved).length,
    approved: profiles.filter((p) => p.isApproved).length,
    featured: profiles.filter((p) => p.isFeatured).length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{profiles.length} users signed up via the website</p>
        </div>
        <button onClick={load} className={BTN_GHOST}>↺ Refresh</button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {(['all', 'pending', 'approved', 'featured'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-primary text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f} <span className="opacity-60 ml-1">({counts[f]})</span>
          </button>
        ))}
        <div className="flex-1 min-w-[180px]">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bio</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    {search ? 'No users match your search.' : 'No users in this filter.'}
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt={p.displayName} className="w-9 h-9 rounded-full object-cover bg-gray-100 shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-black shrink-0">
                          {(p.displayName || 'U').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-gray-900 truncate max-w-[120px]">{p.displayName || '—'}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-gray-500 text-xs truncate max-w-[160px]">
                    {p.email ?? '—'}
                  </td>

                  {/* Bio */}
                  <td className="px-5 py-4 text-gray-500 text-xs max-w-[200px]">
                    <span className="line-clamp-2">{p.bio || <span className="italic opacity-50">No bio</span>}</span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(p.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Approved toggle */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggle(p.id, 'isApproved', !p.isApproved)}
                      className={`w-8 h-5 rounded-full transition-colors ${p.isApproved ? 'bg-primary' : 'bg-gray-200'}`}
                      aria-label={p.isApproved ? 'Revoke approval' : 'Approve'}
                      title={p.isApproved ? 'Approved — click to revoke' : 'Pending — click to approve'}
                    >
                      <span className={`block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform mx-auto ${p.isApproved ? 'translate-x-1.5' : '-translate-x-1.5'}`} />
                    </button>
                  </td>

                  {/* Featured toggle */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggle(p.id, 'isFeatured', !p.isFeatured)}
                      className={`text-lg transition-opacity ${p.isFeatured ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
                      aria-label={p.isFeatured ? 'Unfeature' : 'Feature'}
                      title={p.isFeatured ? 'Featured — click to unfeature' : 'Click to feature'}
                    >
                      ★
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className={BTN_GHOST}>Edit Bio</button>
                      <button onClick={() => setDeleteId(p.id)} className={BTN_DANGER}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Bio Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Edit Bio</h3>
            <p className="text-sm text-gray-400 mb-4">{editing.displayName}</p>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Member bio…"
              maxLength={300}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{editBio.length}/300</p>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setEditing(null)} className={BTN_GHOST}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} className={BTN_PRIMARY}>
                {saving ? 'Saving…' : 'Save Bio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User Profile</h3>
            <p className="text-sm text-gray-500 mb-5">This will remove the profile from the community page. The auth account remains intact.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className={BTN_GHOST}>Cancel</button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegisteredUsersPage;
