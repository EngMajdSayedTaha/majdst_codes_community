import { supabase } from '@lib/supabaseClient';
import type { MemeCard } from '@types';

function toMeme(row: Record<string, unknown>): MemeCard {
  return {
    id: row.id as string,
    title: row.title as string,
    imageUrl: row.image_url as string,
    category: row.category as string,
    likes: row.like_count as number,
    likeCount: row.like_count as number,
    isPublished: row.is_published as boolean | undefined,
    sortOrder: row.sort_order as number | undefined,
    createdAt: row.created_at as string | undefined,
  };
}

class MemesService {
  async getMemes(): Promise<MemeCard[]> {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toMeme);
  }

  async getAllMemes(): Promise<MemeCard[]> {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toMeme);
  }

  async uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('memes')
      .upload(path, file, { upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from('memes').getPublicUrl(path);
    return data.publicUrl;
  }

  async createMeme(meme: { title: string; imageUrl: string; category: string; sortOrder?: number }): Promise<MemeCard> {
    const { data, error } = await supabase
      .from('memes')
      .insert({
        title: meme.title,
        image_url: meme.imageUrl,
        category: meme.category,
        sort_order: meme.sortOrder ?? 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toMeme(data);
  }

  async updateMeme(id: string, meme: Partial<{ title: string; imageUrl: string; category: string; isPublished: boolean; sortOrder: number }>): Promise<MemeCard> {
    const row: Record<string, unknown> = {};
    if (meme.title !== undefined) row.title = meme.title;
    if (meme.imageUrl !== undefined) row.image_url = meme.imageUrl;
    if (meme.category !== undefined) row.category = meme.category;
    if (meme.isPublished !== undefined) row.is_published = meme.isPublished;
    if (meme.sortOrder !== undefined) row.sort_order = meme.sortOrder;
    const { data, error } = await supabase
      .from('memes')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toMeme(data);
  }

  async deleteMeme(id: string): Promise<void> {
    const { error } = await supabase.from('memes').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export const memesService = new MemesService();
export default memesService;
