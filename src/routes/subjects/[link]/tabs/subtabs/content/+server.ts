import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient'; // Predpokladáme, že máš Supabase klienta
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    try {
        const { content, selectedContent, subtabId, contentType } = await request.json();

        if (!content || !selectedContent || !subtabId || !contentType) {
            throw new Error('Chýbajú povinné parametre');
        }

        const contentData = {
            subtab_id: subtabId,
            content_type: contentType,
            content: content,
            index: 1,
            created_at: new Date().toISOString(),
        };

        let tableName = '';
        if (selectedContent === 1) {
            tableName = 'official_content';
        }
        if (selectedContent === 3) {
            tableName = 'private_content';
        }

        const { data, error: insertError } = await supabase
            .from(tableName)
            .insert([contentData]);

        if (insertError) {
            throw new Error(insertError.message);
        }

        return json({ message: 'Obsah bol úspešne uložený', data });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return error(400, { message: err.message });
        } else {
            return error(400, { message: 'Neznáma chyba' });
        }
    }
};

// /src/routes/api/getContent.ts


export const GET: RequestHandler = async ({ url }) => {
    try {
        const subtabId = url.searchParams.get('subtabId'); // Predpokladám, že subtabId posielaš ako query parameter

        if (!subtabId) {
            return json({ message: 'SubtabId je povinný parameter' }, { status: 400 });
        }

        // Načítame obsah pre daný subtabId
        const { data, error } = await supabase
            .from('official_content') // Alebo tabuľka, z ktorej chceš načítať
            .select('id, content_type, content, created_at')
            .eq('subtab_id', subtabId);

        if (error) {
            throw new Error(error.message);
        }

        return json({ content: data });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return json({ message: err.message }, { status: 400 });
        } else {
            return json({ message: 'Neznáma chyba' }, { status: 500 });
        }
    }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    const id = url.searchParams.get('id');

    if (!id) {
        return json({ message: 'ID param je povinný.' }, { status: 400 });
    }

    try {
        const { error: deleteError } = await supabase
            .from('official_content')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error(deleteError);
            return json({ message: 'Mazanie obsahu zlyhalo.' }, { status: 500 });
        }

        return json({ message: 'Obsah bol úspešne odstránený.' }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return json({ message: err.message }, { status: 500 });
        }
        return json({ message: 'Neznáma chyba.' }, { status: 500 });
    }
};

export const PATCH = async ({ request, locals }) => {
    if (!locals.isAdmin) {
        throw error(401, 'Unauthorized');
    }
    const body = await request.json();
    const { id, content } = body;

    // Overenie vstupov
    if (!id || !content) {
        throw error(400, 'id and content are required');
    }

    // Aktualizácia obsahu v tabuľke `official_content`
    const { error: err } = await supabase
        .from('official_content')
        .update({ content })
        .eq('id', id);

    // Spracovanie chyby
    if (err) {
        console.error(err);
        throw error(500, 'Failed to update content');
    }

    // Úspešná odpoveď
    return new Response(null, { status: 204 });
};
