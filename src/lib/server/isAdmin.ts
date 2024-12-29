import type { SupabaseClient } from '@supabase/supabase-js';

export async function isAdmin(userId: string, locals: { supabase: SupabaseClient }): Promise<boolean> {
    const { data, error } = await locals.supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching role:', error);
        return false; // Ak nastane chyba, považuj používateľa za neadmina.
    }

    console.log(data?.role);
    return data?.role === 'admin';
}
