// @ts-nocheck
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    const session = await locals.safeGetSession();

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { data: scheduleItems, error: err } = await supabase
        .from('scheduleitem')
        .select('*')
        .eq('user_id', session.user.id);

    if (err) {
        throw error(500, 'Error loading schedule');
    }

    return {
        scheduleItems: scheduleItems || []
    };
};