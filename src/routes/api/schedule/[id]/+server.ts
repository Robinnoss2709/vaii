import prisma from '../../../../lib/prisma/prisma';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request }) => {
  const id = parseInt(params.id, 10);
  const updateData = await request.json();

  try {
    const updatedItem = await prisma.scheduleItem.update({
      where: { id },
      data: {
        ...updateData,
        color: updateData.color // Aktualizácia farby
      }
    });
    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Item not found or invalid data' }), { status: 404 });
  }
};

