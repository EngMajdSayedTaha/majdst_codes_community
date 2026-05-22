import { supabase } from '@lib/supabaseClient';
import type { CommunityMember } from '@types';

function toMember(row: Record<string, unknown>): CommunityMember {
  return {
    id: row.id as string,
    name: row.name as string,
    githubUsername: row.github_username as string | undefined,
    bio: row.bio as string | undefined,
    avatarUrl: row.avatar_url as string | undefined,
    role: row.role as string | undefined,
    skills: (row.skills as string[]) ?? [],
    githubUrl: row.github_url as string | undefined,
    twitterUrl: row.twitter_url as string | undefined,
    linkedinUrl: row.linkedin_url as string | undefined,
    websiteUrl: row.website_url as string | undefined,
    isFeatured: row.is_featured as boolean | undefined,
    isPublished: row.is_published as boolean | undefined,
    sortOrder: row.sort_order as number | undefined,
    joinedAt: row.joined_at as string | undefined,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function toRow(m: Omit<CommunityMember, 'id'> | Partial<CommunityMember>) {
  const row: Record<string, unknown> = {};
  if (m.name !== undefined) row.name = m.name;
  if (m.githubUsername !== undefined) row.github_username = m.githubUsername;
  if (m.bio !== undefined) row.bio = m.bio;
  if (m.avatarUrl !== undefined) row.avatar_url = m.avatarUrl;
  if (m.role !== undefined) row.role = m.role;
  if (m.skills !== undefined) row.skills = m.skills;
  if (m.githubUrl !== undefined) row.github_url = m.githubUrl;
  if (m.twitterUrl !== undefined) row.twitter_url = m.twitterUrl;
  if (m.linkedinUrl !== undefined) row.linkedin_url = m.linkedinUrl;
  if (m.websiteUrl !== undefined) row.website_url = m.websiteUrl;
  if (m.isFeatured !== undefined) row.is_featured = m.isFeatured;
  if (m.isPublished !== undefined) row.is_published = m.isPublished;
  if (m.sortOrder !== undefined) row.sort_order = m.sortOrder;
  return row;
}

class CommunityMembersService {
  async getMembers(): Promise<CommunityMember[]> {
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toMember);
  }

  async getAllMembers(): Promise<CommunityMember[]> {
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toMember);
  }

  async getFeaturedMembers(): Promise<CommunityMember[]> {
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toMember);
  }

  async getMemberById(id: string): Promise<CommunityMember> {
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return toMember(data);
  }

  async createMember(member: Omit<CommunityMember, 'id'>): Promise<CommunityMember> {
    const { data, error } = await supabase
      .from('community_members')
      .insert(toRow(member))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toMember(data);
  }

  async updateMember(id: string, member: Partial<CommunityMember>): Promise<CommunityMember> {
    const { data, error } = await supabase
      .from('community_members')
      .update(toRow(member))
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toMember(data);
  }

  async deleteMember(id: string): Promise<void> {
    const { error } = await supabase.from('community_members').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const communityMembersService = new CommunityMembersService();
export default communityMembersService;
