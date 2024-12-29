import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.safeGetSession();

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { data: scheduleItems, error: err } = await locals.supabase
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