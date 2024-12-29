// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
    const { link } = params;

    const { data: subjectCard, error: err } = await locals.supabase
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
