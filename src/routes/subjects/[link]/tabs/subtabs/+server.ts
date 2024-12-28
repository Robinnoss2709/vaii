import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

// GET subtabs for a specific tab
export const GET = async ({ url }) => {
    const tabId = url.searchParams.get('tab_id');

    if (!tabId) {
        throw error(400, 'tab_id parameter is required');
    }

    const { data: subtabs, error: err } = await supabase
        .from('subject_panel_sub_tabs')
        .select('*')
        .eq('panel_id', tabId);

    if (err) {
        console.error(err);
        throw error(500, 'Failed to fetch subtabs');
    }

    return json({ subtabs });
};

// POST: Add a new subtab
export const POST = async ({ request, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    const body = await request.json();
    const { panel_id, name } = body;

    if (!panel_id || !name) {
        throw error(400, 'panel_id and name are required');
    }

    const { data, error: err } = await supabase
        .from('subject_panel_sub_tabs')
        .insert({ panel_id, name })
        .select('*')
        .single();

    if (err) {
        console.error(err);
        throw error(500, 'Failed to create subtab');
    }

    return json({ subtab: data });
};

// PATCH: Update a subtab
export const PATCH = async ({ request, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name) {
        throw error(400, 'id and name are required');
    }

    const { error: err } = await supabase
        .from('subject_panel_sub_tabs')
        .update({ name })
        .eq('id', id);

    if (err) {
        console.error(err);
        throw error(500, 'Failed to update subtab');
    }

    return new Response(null, { status: 204 });
};

// DELETE: Remove a subtab
export const DELETE = async ({ url, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    const id = url.searchParams.get('id');

    if (!id) {
        throw error(400, 'id parameter is required');
    }

    const { error: err } = await supabase
        .from('subject_panel_sub_tabs')
        .delete()
        .eq('id', id);

    if (err) {
        console.error(err);
        throw error(500, 'Failed to delete subtab');
    }

    return new Response(null, { status: 204 });
};
