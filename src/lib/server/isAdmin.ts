import { supabase } from "$lib/supabaseClient";

export async function isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
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