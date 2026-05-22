import { useState, useEffect, FormEvent } from 'react';
import { siteSettingsService } from '@features/site-settings/services/siteSettings.service';
import type { SiteStat, AboutProfile } from '@types';

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

const PROFILE_FIELDS: { key: keyof AboutProfile; label: string; span?: boolean }[] = [
  { key: 'name',             label: 'Full Name' },
  { key: 'yearsExperience',  label: 'Years Experience' },
  { key: 'projectsBuilt',    label: 'Projects Built' },
  { key: 'mentoredDevs',     label: 'Mentored Devs' },
  { key: 'bio',              label: 'Bio',          span: true },
  { key: 'bioExtended',      label: 'Extended Bio', span: true },
  { key: 'avatarUrl',        label: 'Avatar URL',   span: true },
  { key: 'githubUrl',        label: 'GitHub URL' },
  { key: 'twitterUrl',       label: 'Twitter URL' },
  { key: 'linkedinUrl',      label: 'LinkedIn URL' },
  { key: 'discordUrl',       label: 'Discord URL' },
  { key: 'telegramUrl',      label: 'Telegram URL' },
];

const AdminSettingsPage = () => {
  const [stats, setStats]             = useState<SiteStat[]>([]);
  const [profileForm, setProfileForm] = useState<Partial<AboutProfile>>({});
  const [saving, setSaving]           = useState<string | null>(null);
  const [toast, setToast]             = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const load = async () => {
    const [s, p] = await Promise.all([siteSettingsService.getAllStats(), siteSettingsService.getAboutProfile()]);
    setStats(s);
    setProfileForm(p ?? {});
  };
  useEffect(() => { load(); }, []);

  const handleStatSave = async (stat: SiteStat) => {
    setSaving(stat.id);
    await siteSettingsService.updateStat(stat.id, { value: stat.value, label: stat.label });
    setSaving(null);
    showToast('Stat updated ✓');
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving('profile');
    await siteSettingsService.upsertAboutProfile(profileForm);
    setSaving(null);
    showToast('Profile saved ✓');
  };

  return (
    <div className="p-8 max-w-4xl space-y-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Settings</h1>
        <p className="text-sm text-gray-500">Manage stats shown on the homepage and your about page profile.</p>
      </div>

      {/* ── Hero Stats ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Hero Stats</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.map(stat => (
                <tr key={stat.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <input
                      className="w-full border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 text-sm"
                      value={stat.label}
                      onChange={e => setStats(prev => prev.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      className="w-full border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 text-sm font-mono"
                      value={stat.value}
                      onChange={e => setStats(prev => prev.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleStatSave(stat)}
                      disabled={saving === stat.id}
                      className="px-3 py-1.5 bg-primary text-black text-xs font-semibold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                    >
                      {saving === stat.id ? 'Saving…' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">No stats configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── About Profile ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-3">About Profile</h2>
        <form onSubmit={handleProfileSave} className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROFILE_FIELDS.map(({ key, label, span }) => (
            <div key={key} className={span ? 'md:col-span-2' : ''}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
              <input
                className={INPUT}
                value={(profileForm[key] as string) ?? ''}
                onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving === 'profile'}
              className="px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors"
            >
              {saving === 'profile' ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminSettingsPage;
