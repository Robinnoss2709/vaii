// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    return {
        isAdmin: locals.isAdmin || false, // Nastaví isAdmin z locals
    };
};
