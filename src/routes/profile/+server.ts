import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { username } = await request.json(); // Parse JSON from the request body
    const session = locals.session; // Get the session from locals

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Použite Supabase z locals
    const { error: updateError } = await locals.supabase
        .from('profiles')
        .update({ username }) // Update the username in the profiles table
        .eq('id', session.user.id); // Match the user by their ID

    if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Profile updated successfully!" }), { status: 200 });
};
