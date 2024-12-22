import prisma from '$lib/prisma/prisma';
import { subjectCardSchema } from '$lib/schemas/tester/subjectCardForm';
import { ZodError } from 'zod';
import type { RequestHandler } from './$types';

const authorizedEmail = 'fricapsuleceo@gmail.com';

export const GET: RequestHandler = async () => {
    // Získanie session z locals


    try {
        const subjects = await prisma.subjectCard.findMany();
        return new Response(JSON.stringify(subjects), { status: 200 });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return new Response(JSON.stringify({ error: 'Unable to fetch subjects' }), { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, locals }) => {
    // Získanie session z locals
    const session = locals.session; // Predpokladá sa, že session je v middleware
    const email = session?.user?.email;

    if (email !== authorizedEmail) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const data = await request.json();

    // Validácia dát so Zod
    try {
        const validatedData = subjectCardSchema.parse(data);

        const newSubject = await prisma.subjectCard.create({
            data: validatedData,
        });
        return new Response(JSON.stringify(newSubject), { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response(JSON.stringify({ error: 'Validation failed', issues: error.errors }), { status: 400 });
        }
        console.error('Error creating subject:', error);
        return new Response(JSON.stringify({ error: 'Unable to create subject' }), { status: 500 });
    }
};
