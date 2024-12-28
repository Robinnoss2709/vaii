import { e as error } from "../../../../chunks/index.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
const load = async ({ params, locals }) => {
  const { link } = params;
  const { data: subjectCard, error: err } = await supabase.from("subject_card").select("*").eq("link", link).single();
  if (err || !subjectCard) {
    console.error("Chyba pri načítaní predmetu:", err);
    throw error(404, "Predmet neexistuje.");
  }
  return {
    subject: subjectCard,
    isAdmin: locals.isAdmin || false
    // Nastaví isAdmin z locals
  };
};
export {
  load
};
