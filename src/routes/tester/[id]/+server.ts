import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    const { id } = params;
    const updateData = await request.json();

    if (!id) {
        throw error(400, 'Invalid ID');
    }

    const { data: updatedItem, error: err } = await locals.supabase
        .from('subject_card')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (err) {
        throw error(500, err.message);
    }

    return json(updatedItem);
};