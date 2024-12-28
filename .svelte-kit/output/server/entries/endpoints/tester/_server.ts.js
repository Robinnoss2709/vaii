import { e as error, j as json } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
const GET = async ({ locals }) => {
  const { data: subjectCard, error: err } = await supabase.from("subject_card").select("*");
  if (err) {
    throw error(500, "Error loading schedule");
  }
  return json(subjectCard);
};
const POST = async ({ request, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const data = await request.json();
  const { data: subjectCard, error: err } = await supabase.from("subject_card").insert([{
    ...data
  }]).select().single();
  if (err) {
    throw error(500, err.message);
  }
  return json(subjectCard);
};
const DELETE = async ({ url, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const id = url.searchParams.get("id");
  if (!id) {
    throw error(400, "Invalid ID");
  }
  const { error: err } = await supabase.from("subject_card").delete().eq("id", id);
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
