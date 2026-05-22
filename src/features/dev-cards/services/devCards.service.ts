import { supabase } from '@lib/supabaseClient';
import type { DevCard } from '@types';

function toDevCard(row: Record<string, unknown>): DevCard {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    difficulty: row.difficulty as DevCard['difficulty'],
    learningTime: row.learning_time as string,
    icon: row.icon as string,
    topics: (row.topics as string[]) ?? [],
    link: row.link as string | undefined,
    funFact: row.fun_fact as string | undefined,
    tagKey: row.tag_key as string | undefined,
    savesCount: row.saves_count as number | undefined,
    isPublished: row.is_published as boolean | undefined,
    sortOrder: row.sort_order as number | undefined,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function toRow(card: Omit<DevCard, 'id'> | Partial<DevCard>) {
  const row: Record<string, unknown> = {};
  if (card.title !== undefined) row.title = card.title;
  if (card.description !== undefined) row.description = card.description;
  if (card.difficulty !== undefined) row.difficulty = card.difficulty;
  if ((card as DevCard).learningTime !== undefined) row.learning_time = (card as DevCard).learningTime;
  if (card.icon !== undefined) row.icon = card.icon;
  if (card.topics !== undefined) row.topics = card.topics;
  if (card.link !== undefined) row.link = card.link;
  if (card.funFact !== undefined) row.fun_fact = card.funFact;
  if (card.tagKey !== undefined) row.tag_key = card.tagKey;
  if (card.savesCount !== undefined) row.saves_count = card.savesCount;
  if (card.isPublished !== undefined) row.is_published = card.isPublished;
  if (card.sortOrder !== undefined) row.sort_order = card.sortOrder;
  return row;
}

class DevCardsService {
  async getDevCards(): Promise<DevCard[]> {
    const { data, error } = await supabase
      .from('dev_cards')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toDevCard);
  }

  async getAllDevCards(): Promise<DevCard[]> {
    const { data, error } = await supabase
      .from('dev_cards')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toDevCard);
  }

  async getDevCardById(id: string): Promise<DevCard> {
    const { data, error } = await supabase
      .from('dev_cards')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return toDevCard(data);
  }

  async getDevCardsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<DevCard[]> {
    const { data, error } = await supabase
      .from('dev_cards')
      .select('*')
      .eq('is_published', true)
      .eq('difficulty', difficulty)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toDevCard);
  }

  async searchDevCards(query: string): Promise<DevCard[]> {
    const { data, error } = await supabase
      .from('dev_cards')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toDevCard);
  }

  async createDevCard(card: Omit<DevCard, 'id'>): Promise<DevCard> {
    const { data, error } = await supabase
      .from('dev_cards')
      .insert(toRow(card))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toDevCard(data);
  }

  async updateDevCard(id: string, card: Partial<DevCard>): Promise<DevCard> {
    const { data, error } = await supabase
      .from('dev_cards')
      .update(toRow(card))
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toDevCard(data);
  }

  async deleteDevCard(id: string): Promise<void> {
    const { error } = await supabase.from('dev_cards').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const devCardsService = new DevCardsService();
export default devCardsService;