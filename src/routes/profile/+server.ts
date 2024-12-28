import { error, json, type RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';



export const POST: RequestHandler = async ({ request, locals }) => {
    const { username } = await request.json(); // Parse JSON from the request body
    const session = locals.session; // Get the session from locals

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { error } = await supabase
        .from('profiles')
        .update({ username }) // Update the username in the profiles table
        .eq('id', session.user.id); // Match the user by their ID

    if (error) {
        console.error("Error updating profile:", error);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Profile updated successfully!" }), { status: 200 });
};
