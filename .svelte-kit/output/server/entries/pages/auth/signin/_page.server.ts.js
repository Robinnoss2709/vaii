import { r as redirect } from "../../../../chunks/index.js";
const load = async ({ locals }) => {
  const { supabase } = locals;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    throw redirect(303, "/");
  }
  return {};
};
export {
  load
};
