import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    return {
        isAdmin: locals.isAdmin || false, // Nastaví isAdmin z locals
    };
};
