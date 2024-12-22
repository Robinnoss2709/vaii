import prisma from '$lib/prisma/prisma';
import { subjectCardSchema } from '$lib/schemas/tester/subjectCardForm';
import { ZodError } from 'zod';
import type { RequestHandler } from './$types';

const authorizedEmail = 'fricapsuleceo@gmail.com';


export const PATCH: RequestHandler = async ({ request, params, locals }) => {
    const session = locals.session; // Predpokladá sa, že session je v middleware
    const email = session?.user?.email;

    if (email !== authorizedEmail) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    const data = await request.json();

    // Validácia dát so Zod
    try {
        const validatedData = subjectCardSchema.parse(data);

        const updatedSubject = await prisma.subjectCard.update({
            where: { id: Number(id) },
            data: validatedData,
        });

        return new Response(JSON.stringify(updatedSubject), { status: 200 });
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response(JSON.stringify({ error: 'Validation failed', issues: error.errors }), { status: 400 });
        }
        console.error('Error updating subject:', error);
        return new Response(JSON.stringify({ error: 'Unable to update subject' }), { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const session = locals.session; // Predpokladá sa, že session je v middleware
    const email = session?.user?.email;

    if (email !== authorizedEmail) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        return new Response(JSON.stringify({ error: 'Invalid subject ID' }), { status: 400 });
    }

    try {
        await prisma.subjectCard.delete({
            where: { id },
        });
        return new Response(JSON.stringify({ message: `Subject with ID ${id} deleted` }), { status: 200 });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return new Response(JSON.stringify({ error: 'Subject not found' }), { status: 404 });
    }
};
