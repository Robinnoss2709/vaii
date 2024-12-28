const POST = async ({ locals }) => {
  await locals.supabase.auth.signOut();
  return new Response(null, { status: 200 });
};
export {
  POST
};
