import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private readonly supabaseUrl = process.env.SUPABASE_URL;
  private readonly supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  private supabase = createClient(
    this.supabaseUrl,
    this.supabaseKey
  );

  constructor() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error(
        'Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY).',
      );
    }
  }

  async findAll() { 
    const { data } = await this.supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    return data;
  }
  async create(dto: any) { return await this.supabase.from('guestbook').insert([dto]); }
  async update(id: string, dto: any) { return await this.supabase.from('guestbook').update(dto).eq('id', id); }
  async delete(id: string) { return await this.supabase.from('guestbook').delete().eq('id', id); }
}
