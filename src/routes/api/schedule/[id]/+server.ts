import prisma from '../../../../lib/prisma/prisma'; // Predpokladáme, že Prisma Client je inicializovaný v $lib/prisma.ts
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    await prisma.scheduleItem.delete({
      where: { id }
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
  }
};