import { e as error } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
const load = async ({ locals }) => {
  const session = await locals.safeGetSession();
  if (!session) {
    throw error(401, "Unauthorized");
  }
  const { data: scheduleItems, error: err } = await supabase.from("scheduleitem").select("*").eq("user_id", session.user.id);
  if (err) {
    throw error(500, "Error loading schedule");
  }
  return {
    scheduleItems: scheduleItems || []
  };
};
export {
  load
};
