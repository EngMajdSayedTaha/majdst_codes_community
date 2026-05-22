import { supabase } from '@lib/supabaseClient';
import type { Challenge, ChallengeSubmission } from '@types';

function toChallenge(row: Record<string, unknown>): Challenge {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    difficulty: row.difficulty as Challenge['difficulty'],
    reward: row.reward as number,
    featured: row.is_featured as boolean | undefined,
    week: row.week as number | undefined,
    date: (row.start_date ?? row.created_at) as string | undefined,
    status: row.status as Challenge['status'],
    link: row.link as string | undefined,
    tags: (row.tags as string[]) ?? [],
    winnerHandle: row.winner_handle as string | undefined,
    startDate: row.start_date as string | undefined,
    endDate: row.end_date as string | undefined,
    isPublished: row.is_published as boolean | undefined,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function toRow(c: Omit<Challenge, 'id'> | Partial<Challenge>) {
  const row: Record<string, unknown> = {};
  if (c.title !== undefined) row.title = c.title;
  if (c.description !== undefined) row.description = c.description;
  if (c.difficulty !== undefined) row.difficulty = c.difficulty;
  if (c.reward !== undefined) row.reward = c.reward;
  if (c.featured !== undefined) row.is_featured = c.featured;
  if (c.week !== undefined) row.week = c.week;
  if (c.status !== undefined) row.status = c.status;
  if (c.link !== undefined) row.link = c.link;
  if (c.tags !== undefined) row.tags = c.tags;
  if (c.winnerHandle !== undefined) row.winner_handle = c.winnerHandle;
  if (c.startDate !== undefined) row.start_date = c.startDate;
  if (c.endDate !== undefined) row.end_date = c.endDate;
  if (c.isPublished !== undefined) row.is_published = c.isPublished;
  return row;
}

class ChallengesService {
  async getChallenges(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toChallenge);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toChallenge);
  }

  async getFeaturedChallenge(): Promise<Challenge | null> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toChallenge(data) : null;
  }

  async getChallengeById(id: string): Promise<Challenge> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return toChallenge(data);
  }

  async getChallengesByStatus(status: 'upcoming' | 'active' | 'completed'): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_published', true)
      .eq('status', status)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toChallenge);
  }

  async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<Challenge> {
    const { data, error } = await supabase
      .from('challenges')
      .insert(toRow(challenge))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toChallenge(data);
  }

  async updateChallenge(id: string, challenge: Partial<Challenge>): Promise<Challenge> {
    const { data, error } = await supabase
      .from('challenges')
      .update(toRow(challenge))
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toChallenge(data);
  }

  async deleteChallenge(id: string): Promise<void> {
    const { error } = await supabase.from('challenges').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async submitChallenge(submission: Omit<ChallengeSubmission, 'id' | 'status' | 'submittedAt'>): Promise<void> {
    const { error } = await supabase.from('challenge_submissions').insert({
      challenge_id: submission.challengeId,
      handle: submission.handle,
      solution: submission.solution,
    });
    if (error) throw new Error(error.message);
  }

  async getSubmissions(challengeId?: string): Promise<ChallengeSubmission[]> {
    let query = supabase.from('challenge_submissions').select('*').order('submitted_at', { ascending: false });
    if (challengeId) query = query.eq('challenge_id', challengeId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      challengeId: r.challenge_id as string,
      handle: r.handle as string,
      solution: r.solution as string,
      status: r.status as ChallengeSubmission['status'],
      adminNotes: r.admin_notes as string | undefined,
      submittedAt: r.submitted_at as string,
    }));
  }

  async updateSubmissionStatus(id: string, status: ChallengeSubmission['status'], adminNotes?: string): Promise<void> {
    const { error } = await supabase
      .from('challenge_submissions')
      .update({ status, admin_notes: adminNotes })
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const challengesService = new ChallengesService();
export default challengesService;