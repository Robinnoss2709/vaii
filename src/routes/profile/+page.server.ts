import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, locals }) => {

    const session = await locals.safeGetSession();

    if (!session) {
        throw redirect(302, '/auth/signin');
    }

    let username = null;

    if (session) {
        const { data, error } = await locals.supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();

        if (error) {
            console.error("Error fetching username:", error);
        } else {
            username = data?.username ?? null; // Get the username or set to null
        }
    }

    return {
        username
    };

};