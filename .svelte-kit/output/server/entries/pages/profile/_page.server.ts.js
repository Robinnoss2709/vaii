import { r as redirect } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
const load = async ({ request, locals }) => {
  const session = await locals.safeGetSession();
  if (!session) {
    throw redirect(302, "/auth/login");
  }
};
export {
  load
};
