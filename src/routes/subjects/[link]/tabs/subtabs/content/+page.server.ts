import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    console.log(locals.isAdmin);
    return {
        isAdmin: locals.isAdmin || false, // Nastaví isAdmin z locals
    };
};
