import { e as error } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
const load = async ({ locals }) => {
  const { data: subjectCards, error: err } = await supabase.from("subject_card").select("*");
  if (err) {
    throw error(500, "Error loading subject cards");
  }
  return {
    subjectCards: subjectCards || [],
    isAdmin: locals.isAdmin || false
    // Nastaví isAdmin z locals
  };
};
export {
  load
};
