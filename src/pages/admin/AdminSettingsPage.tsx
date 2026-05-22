import { useState, useEffect, FormEvent } from 'react';
import { siteSettingsService } from '@features/site-settings/services/siteSettings.service';
import type { SiteStat, AboutProfile } from '@types';

const AdminSettingsPage = () => {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<Partial<AboutProfile>>({});

  const load = async () => {
    const [s, p] = await Promise.all([
      siteSettingsService.getAllStats(),
      siteSettingsService.getAboutProfile(),
    ]);
    setStats(s);
    setProfileForm(p ?? {});
  };

  useEffect(() => { load(); }, []);

  const handleStatSave = async (stat: SiteStat) => {
    setSaving(stat.id);
    await siteSettingsService.updateStat(stat.id, { value: stat.value, label: stat.label });
    setSaving(null);
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving('profile');
    await siteSettingsService.upsertAboutProfile(profileForm);
    setSaving(null);
  };

  const PROFILE_FIELDS: { key: keyof AboutProfile; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'bio', label: 'Bio' },
    { key: 'bioExtended', label: 'Bio (extended)' },
    { key: 'avatarUrl', label: 'Avatar URL' },
    { key: 'yearsExperience', label: 'Years Experience' },
    { key: 'projectsBuilt', label: 'Projects Built' },
    { key: 'mentoredDevs', label: 'Mentored Devs' },
    { key: 'githubUrl', label: 'GitHub URL' },
    { key: 'twitterUrl', label: 'Twitter URL' },
    { key: 'linkedinUrl', label: 'LinkedIn URL' },
    { key: 'discordUrl', label: 'Discord URL' },
    { key: 'telegramUrl', label: 'Telegram URL' },
  ];

  return (
    <div className="p-8 space-y-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

        {/* Hero Stats */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hero Stats</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.map(stat => (
                <tr key={stat.id}>
                  <td className="px-4 py-2">
                    <input
                      className="w-full border-0 border-b focus:outline-none focus:border-primary text-sm py-1"
                      value={stat.label}
                      onChange={e => setStats(prev => prev.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className="w-full border-0 border-b focus:outline-none focus:border-primary text-sm py-1"
                      value={stat.value}
                      onChange={e => setStats(prev => prev.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStatSave(stat)}
                      disabled={saving === stat.id}
                      className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
                    >
                      {saving === stat.id ? 'Saving…' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* About Profile */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">About Profile</h2>
        <form onSubmit={handleProfileSave} className="bg-white rounded-xl shadow p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROFILE_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={(profileForm[key] as string) ?? ''}
                onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving === 'profile'} className="px-6 py-2 bg-primary text-black rounded-lg font-semibold disabled:opacity-50">
              {saving === 'profile' ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
