import { useState, useEffect } from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { userProfileService, type UserProfile } from '@features/auth/services/userProfile.service';
import { useUserAuth } from '@features/auth';

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: UserProfile }) {
  const initials = member.displayName.slice(0, 2).toUpperCase() || '??';

  return (
    <div className="member-card">
      <div className="member-avatar-wrap">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.displayName}
            className="member-avatar-img"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="member-avatar-fallback">{initials}</div>
        )}
        {member.isFeatured && <span className="member-featured-badge">★</span>}
      </div>

      <div className="member-info">
        <div className="member-name">{member.displayName}</div>
        {member.bio && <p className="member-bio">{member.bio}</p>}
        <div className="member-joined">
          Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      </div>

      {(member.githubUrl || member.twitterUrl || member.linkedinUrl || member.websiteUrl) && (
        <div className="member-links">
          {member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="member-link" aria-label="GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {member.twitterUrl && (
            <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="member-link" aria-label="Twitter / X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="member-link" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {member.websiteUrl && (
            <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer" className="member-link" aria-label="Website">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { user, openAuthModal } = useUserAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userProfileService.getApprovedProfiles()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? members.filter((m) =>
        m.displayName.toLowerCase().includes(search.toLowerCase()) ||
        m.bio.toLowerCase().includes(search.toLowerCase()),
      )
    : members;

  const featured = filtered.filter((m) => m.isFeatured);
  const rest     = filtered.filter((m) => !m.isFeatured);

  return (
    <>
      <Navbar />
      <section className="community-section page-section">
        <div className="section-inner">
          {/* Header */}
          <div className="section-eyebrow">// community_members</div>
          <h1 className="section-heading">The People Behind the Code</h1>
          <p className="section-sub">
            Developers who joined the majdst_codes community. Every one of them is building something real.
          </p>

          {/* CTA for non-members */}
          {!user && (
            <div className="community-join-cta">
              <span className="community-join-text">Already part of the community? Your card lives here.</span>
              <button
                className="ch-btn ch-btn-primary"
                onClick={() => openAuthModal({ mode: 'register' })}
              >
                Create Your Profile →
              </button>
            </div>
          )}

          {/* Search */}
          {members.length > 4 && (
            <div className="community-search-wrap">
              <input
                className="community-search"
                type="search"
                placeholder="Search members…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search community members"
              />
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="community-loading">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="member-card member-card-skeleton" aria-hidden="true" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="community-empty">
              <div className="community-empty-icon">◈</div>
              <p>{search ? 'No members match your search.' : 'No approved members yet — be the first!'}</p>
              {!user && !search && (
                <button
                  className="ch-btn ch-btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => openAuthModal({ mode: 'register' })}
                >
                  Join Now →
                </button>
              )}
            </div>
          )}

          {/* Featured */}
          {!loading && featured.length > 0 && (
            <>
              <div className="community-section-label">⭐ Featured Members</div>
              <div className="member-grid">
                {featured.map((m) => <MemberCard key={m.id} member={m} />)}
              </div>
            </>
          )}

          {/* All others */}
          {!loading && rest.length > 0 && (
            <>
              {featured.length > 0 && <div className="community-section-label">All Members</div>}
              <div className="member-grid">
                {rest.map((m) => <MemberCard key={m.id} member={m} />)}
              </div>
            </>
          )}

          {/* Count */}
          {!loading && members.length > 0 && (
            <p className="community-count">{members.length} member{members.length !== 1 ? 's' : ''} and counting</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
