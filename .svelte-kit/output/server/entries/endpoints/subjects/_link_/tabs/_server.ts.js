import { j as json, e as error } from "../../../../../chunks/index.js";
import { s as supabase } from "../../../../../chunks/supabaseClient.js";
const GET = async ({ params }) => {
  const { link } = params;
  const { data: subject, error: subjectError } = await supabase.from("subject_card").select("id").eq("link", link).single();
  if (subjectError || !subject) {
    return json({ error: "Predmet nenájdený" }, { status: 404 });
  }
  const { data: panels, error: panelError } = await supabase.from("subject_panel").select("id, name, subject_id").eq("subject_id", subject.id);
  if (panelError) {
    return json({ error: panelError.message }, { status: 500 });
  }
  return json({ panels });
};
const POST = async ({ params, request, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const { link } = params;
  const { name } = await request.json();
  const { data: subject, error: subjectError } = await supabase.from("subject_card").select("id").eq("link", link).single();
  if (subjectError || !subject) {
    return json({ error: "Predmet nenájdený" }, { status: 404 });
  }
  const { data, error: error$1 } = await supabase.from("subject_panel").insert({ name, subject_id: subject.id }).select().single();
  if (error$1) {
    return json({ error: error$1.message }, { status: 500 });
  }
  return json({ panel: data });
};
const DELETE = async ({ url, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const panelId = url.searchParams.get("id");
  if (!panelId) {
    return new Response("ID tabu je povinné.", { status: 400 });
  }
  const { error: error$1 } = await supabase.from("subject_panel").delete().eq("id", panelId);
  if (error$1) {
    return new Response("Chyba pri odstraňovaní tabu.", { status: 500 });
  }
  return new Response("Tab bol úspešne odstránený.", { status: 200 });
};
const PATCH = async ({ request, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const { id, name } = await request.json();
  if (!id || !name) {
    return new Response("ID a nový názov tabu sú povinné.", { status: 400 });
  }
  const { error: error$1 } = await supabase.from("subject_panel").update({ name }).eq("id", id);
  if (error$1) {
    return new Response("Chyba pri úprave tabu.", { status: 500 });
  }
  return new Response("Tab bol úspešne upravený.", { status: 200 });
};
export {
  DELETE,
  GET,
  PATCH,
  POST
};
