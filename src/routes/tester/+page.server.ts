import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {

    const { data: subjectCards, error: err } = await locals.supabase
        .from('subject_card')
        .select('*')

    if (err) {
        throw error(500, 'Error loading subject cards');
    }

    return {
        subjectCards: subjectCards || [],
        isAdmin: locals.isAdmin || false, // Nastaví isAdmin z locals

    };
};