// @ts-nocheck
import { error, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {

    const { data: subjectCards, error: err } = await supabase
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