import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const { supabase } = locals; // Predpokladám, že supabase je v locals nastavené
    const { data: { user } } = await supabase.auth.getUser();

    // Ak je používateľ prihlásený, presmeruj ho na domovskú stránku
    if (user) {
        throw redirect(303, '/');
    }

    // Pokračuj, ak používateľ nie je prihlásený
    return {};
};
