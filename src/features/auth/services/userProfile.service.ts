import { supabase } from '@lib/supabaseClient';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  bio: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  joinedAt: string;
  updatedAt: string;
}

function toProfile(row: Record<string, unknown>): UserProfile {
  return {
    id:          row.id as string,
    displayName: (row.display_name as string) || '',
    email:       row.email as string | undefined,
    avatarUrl:   row.avatar_url as string | undefined,
    bio:         (row.bio as string) || '',
    githubUrl:   row.github_url as string | undefined,
    twitterUrl:  row.twitter_url as string | undefined,
    linkedinUrl: row.linkedin_url as string | undefined,
    websiteUrl:  row.website_url as string | undefined,
    isApproved:  Boolean(row.is_approved),
    isFeatured:  Boolean(row.is_featured),
    joinedAt:    row.joined_at as string,
    updatedAt:   row.updated_at as string,
  };
}

class UserProfileService {
  /** Upsert profile on sign-up or OAuth sign-in. Safe to call multiple times.
   * Only syncs display_name, email, avatar_url — never overwrites bio/social links.
   * Sets is_approved = true on first insert so the user appears in the community. */
  async upsertProfile(profile: {
    id: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
  }): Promise<void> {
    // Upsert sends only these columns; existing bio/social links are untouched.
    // is_approved is set to true on INSERT (ignored on UPDATE via onConflict merge).
    await supabase.from('user_profiles').upsert(
      {
        id:           profile.id,
        display_name: profile.displayName,
        email:        profile.email ?? null,
        avatar_url:   profile.avatarUrl ?? null,
        is_approved:  true,
      },
      { onConflict: 'id', ignoreDuplicates: false },
    );
  }

  /** Get all approved profiles (public community wall). */
  async getApprovedProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('is_approved', true)
      .order('joined_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toProfile);
  }

  /** Get ALL profiles — admin only. */
  async getAllProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('joined_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toProfile);
  }

  /** Get the current user's own profile. */
  async getOwnProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toProfile(data) : null;
  }

  /** Update any field (used by admin and own-profile edit). */
  async updateProfile(id: string, patch: Partial<Omit<UserProfile, 'id' | 'joinedAt' | 'updatedAt'>>): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.displayName !== undefined) row.display_name  = patch.displayName;
    if (patch.email       !== undefined) row.email         = patch.email;
    if (patch.avatarUrl   !== undefined) row.avatar_url    = patch.avatarUrl;
    if (patch.bio         !== undefined) row.bio           = patch.bio;
    if (patch.githubUrl   !== undefined) row.github_url    = patch.githubUrl;
    if (patch.twitterUrl  !== undefined) row.twitter_url   = patch.twitterUrl;
    if (patch.linkedinUrl !== undefined) row.linkedin_url  = patch.linkedinUrl;
    if (patch.websiteUrl  !== undefined) row.website_url   = patch.websiteUrl;
    if (patch.isApproved  !== undefined) row.is_approved   = patch.isApproved;
    if (patch.isFeatured  !== undefined) row.is_featured   = patch.isFeatured;

    const { error } = await supabase.from('user_profiles').update(row).eq('id', id);
    if (error) throw new Error(error.message);
  }

  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from('user_profiles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const userProfileService = new UserProfileService();
