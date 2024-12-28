import { e as error, j as json } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
const GET = async ({ locals }) => {
  const session = await locals.safeGetSession();
  if (!session) {
    throw error(401, "Unauthorized");
  }
  const { data: scheduleItems, error: err } = await supabase.from("scheduleitem").select("*").eq("user_id", session.user.id);
  if (err) {
    throw error(500, "Error loading schedule");
  }
  return json(scheduleItems);
};
const POST = async ({ request, locals }) => {
  const session = await locals.safeGetSession();
  if (!session) {
    throw error(401, "Unauthorized");
  }
  const data = await request.json();
  const { data: scheduleItem, error: err } = await supabase.from("scheduleitem").insert([{
    ...data,
    user_id: session.user.id
  }]).select().single();
  if (err) {
    throw error(500, err.message);
  }
  return json(scheduleItem);
};
const DELETE = async ({ url, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const session = await locals.safeGetSession();
  if (!session) {
    throw error(401, "Unauthorized");
  }
  const id = url.searchParams.get("id");
  if (!id) {
    throw error(400, "Invalid ID");
  }
  const { error: err } = await supabase.from("scheduleitem").delete().eq("id", id).eq("user_id", session.user.id);
  if (err) {
    throw error(500, err.message);
  }
  return json({ success: true });
};
export {
  DELETE,
  GET,
  POST
};