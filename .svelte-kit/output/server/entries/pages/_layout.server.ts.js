const load = async ({ locals: { safeGetSession }, cookies, locals }) => {
  const { session } = await safeGetSession();
  return {
    session,
    cookies: cookies.getAll()
  };
};
export {
  load
};
