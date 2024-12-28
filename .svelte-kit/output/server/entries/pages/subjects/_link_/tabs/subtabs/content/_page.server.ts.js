const load = async ({ locals }) => {
  console.log(locals.isAdmin);
  return {
    isAdmin: locals.isAdmin || false
    // Nastaví isAdmin z locals
  };
};
export {
  load
};
