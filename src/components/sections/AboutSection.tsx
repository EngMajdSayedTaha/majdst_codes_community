// About Section Component
import { useAboutProfile } from '@features/site-settings/hooks/useAboutProfile';

const SOCIAL_ICONS: Record<string, string> = {
  github: '💻',
  twitter: '🐦',
  linkedin: '💼',
  discord: '🎮',
  telegram: '✈️',
};

const AboutSection = () => {
  const { profile } = useAboutProfile();

  const socialLinks = profile
    ? [
        profile.githubUrl && { name: 'GitHub', icon: SOCIAL_ICONS.github, url: profile.githubUrl },
        profile.twitterUrl && { name: 'Twitter', icon: SOCIAL_ICONS.twitter, url: profile.twitterUrl },
        profile.linkedinUrl && { name: 'LinkedIn', icon: SOCIAL_ICONS.linkedin, url: profile.linkedinUrl },
        profile.discordUrl && { name: 'Discord', icon: SOCIAL_ICONS.discord, url: profile.discordUrl },
        profile.telegramUrl && { name: 'Telegram', icon: SOCIAL_ICONS.telegram, url: profile.telegramUrl },
      ].filter(Boolean) as { name: string; icon: string; url: string }[]
    : [];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Avatar */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <img
                src={profile?.avatarUrl || '/images/profile.jpg'}
                alt={profile?.name ?? 'Majd'}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                className="profile-avatar-large w-full h-full object-cover"
              />
              <span className="text-6xl" style={{ display: 'none' }} aria-hidden>👨‍💻</span>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Hey, I'm {profile?.name ?? 'Majd'}! 👋
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {profile?.bio ?? 'A passionate full-stack developer and community builder dedicated to helping developers grow and learn together.'}
              </p>
              {profile?.bioExtended && (
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.bioExtended}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div>
                <p className="text-3xl font-bold text-primary">{profile?.yearsExperience ?? '10+'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{profile?.projectsBuilt ?? '50+'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Projects Built</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{profile?.mentoredDevs ?? '100+'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mentored Devs</p>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4 pt-6">
                {socialLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary hover:bg-opacity-10 transition-all"
                    title={link.name}
                  >
                    <span className="text-xl">{link.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;