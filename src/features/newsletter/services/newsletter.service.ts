import { supabase } from '@lib/supabaseClient';

class NewsletterService {
  async subscribe(email: string, firstName?: string): Promise<void> {
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      {
        email,
        first_name: firstName ?? null,
        status: 'confirmed',
        preferences: ['weekly-digest', 'new-challenges'],
      },
      { onConflict: 'email' }
    );
    if (error) throw new Error(error.message);
  }

  async unsubscribe(email: string): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email);
    if (error) throw new Error(error.message);
  }

  async getSubscriberCount(): Promise<number> {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');
    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  async getSubscribers() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email');
    if (error) console.error('[newsletter] getSubscribers error:', error);
    return data ?? [];
  }
}

export const newsletterService = new NewsletterService();
export default newsletterService;