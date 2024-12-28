const load = async ({ locals }) => {
  return {
    isAdmin: locals.isAdmin || false
    // Nastaví isAdmin z locals
  };
};
export {
  load
};
