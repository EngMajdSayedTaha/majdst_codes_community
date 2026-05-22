import { supabase } from '@lib/supabaseClient';
import type { SiteStat, AboutProfile } from '@types';

function toStat(row: Record<string, unknown>): SiteStat {
  return {
    id: row.id as string,
    label: row.label as string,
    value: row.value as string,
    icon: row.icon as string | undefined,
    sortOrder: row.sort_order as number,
    isPublished: row.is_published as boolean,
    updatedAt: row.updated_at as string,
  };
}

function toAboutProfile(row: Record<string, unknown>): AboutProfile {
  return {
    id: row.id as string,
    name: row.name as string,
    bio: row.bio as string,
    bioExtended: row.bio_extended as string | undefined,
    yearsExperience: row.years_experience as string,
    projectsBuilt: row.projects_built as string,
    mentoredDevs: row.mentored_devs as string,
    avatarUrl: row.avatar_url as string | undefined,
    githubUrl: row.github_url as string | undefined,
    twitterUrl: row.twitter_url as string | undefined,
    linkedinUrl: row.linkedin_url as string | undefined,
    discordUrl: row.discord_url as string | undefined,
    telegramUrl: row.telegram_url as string | undefined,
    updatedAt: row.updated_at as string,
  };
}

class SiteSettingsService {
  async getStats(): Promise<SiteStat[]> {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toStat);
  }

  async getAllStats(): Promise<SiteStat[]> {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toStat);
  }

  async updateStat(id: string, updates: Partial<Pick<SiteStat, 'label' | 'value' | 'icon' | 'sortOrder' | 'isPublished'>>): Promise<SiteStat> {
    const row: Record<string, unknown> = {};
    if (updates.label !== undefined) row.label = updates.label;
    if (updates.value !== undefined) row.value = updates.value;
    if (updates.icon !== undefined) row.icon = updates.icon;
    if (updates.sortOrder !== undefined) row.sort_order = updates.sortOrder;
    if (updates.isPublished !== undefined) row.is_published = updates.isPublished;
    const { data, error } = await supabase
      .from('site_stats')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toStat(data);
  }

  async getAboutProfile(): Promise<AboutProfile | null> {
    const { data, error } = await supabase
      .from('about_profile')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toAboutProfile(data) : null;
  }

  async upsertAboutProfile(profile: Partial<AboutProfile> & { id?: string }): Promise<AboutProfile> {
    const row: Record<string, unknown> = {
      name: profile.name,
      bio: profile.bio,
      bio_extended: profile.bioExtended,
      years_experience: profile.yearsExperience,
      projects_built: profile.projectsBuilt,
      mentored_devs: profile.mentoredDevs,
      avatar_url: profile.avatarUrl,
      github_url: profile.githubUrl,
      twitter_url: profile.twitterUrl,
      linkedin_url: profile.linkedinUrl,
      discord_url: profile.discordUrl,
      telegram_url: profile.telegramUrl,
    };
    if (profile.id) row.id = profile.id;
    const { data, error } = await supabase
      .from('about_profile')
      .upsert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toAboutProfile(data);
  }

  async getLiveCounts(): Promise<{ cards: number; challenges: number; members: number }> {
    const [c1, c2, c3] = await Promise.all([
      supabase.from('dev_cards').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('challenges').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    ]);
    return {
      cards: c1.count ?? 0,
      challenges: c2.count ?? 0,
      members: c3.count ?? 0,
    };
  }
}

export const siteSettingsService = new SiteSettingsService();
export default siteSettingsService;
