import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const { link } = params;

    const { data: subjectCard, error: err } = await supabase
        .from('subject_card')
        .select('*')
        .eq('link', link)
        .single();

    if (err || !subjectCard) {
        console.error('Chyba pri načítaní predmetu:', err);
        throw error(404, 'Predmet neexistuje.');
    }

    return {
        subject: subjectCard,
        isAdmin: locals.isAdmin || false, // Nastaví isAdmin z locals
    };
};
