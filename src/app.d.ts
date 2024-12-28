import { SupabaseClient, Session } from '@supabase/supabase-js'
import { Database } from '$lib/types/supabase'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
      isAdmin: boolean; // Pridaná vlastnosť pre admin status
      username: string | null;
    }
    interface PageData {
      session: Session | null
    }
  }
}