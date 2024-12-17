import prisma from '../../lib/prisma/prisma';

// GET: Načítanie rozvrhu pre aktuálneho používateľa
export async function GET({ locals }) {
  const user = locals.user;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const scheduleItems = await prisma.scheduleItem.findMany({
    where: { userId: user.id },
  });

  return new Response(JSON.stringify(scheduleItems), { status: 200 });
}

// POST: Vytvorenie položky rozvrhu pre aktuálneho používateľa
export async function POST({ request, locals }) {
  const user = locals.user;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const data = await request.json();

  const scheduleItem = await prisma.scheduleItem.create({
    data: {
      ...data,
      userId: user.id, // Priradenie aktuálneho používateľa
      color: data.color || 'bg-gray-400', // Default farba
    },
  });

  return new Response(JSON.stringify(scheduleItem), { status: 201 });
}

// DELETE: Vymazanie položky rozvrhu aktuálneho používateľa
export async function DELETE({ url, locals }) {
  const user = locals.user;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = url.searchParams.get('id');

  if (!id || isNaN(parseInt(id, 10))) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    await prisma.scheduleItem.deleteMany({
      where: { id: parseInt(id, 10), userId: user.id },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
  }
}

// PATCH: Aktualizácia položky rozvrhu aktuálneho používateľa
export async function PATCH({ request, locals }) {
  const user = locals.user;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const data = await request.json();
  const { id, ...updateData } = data;

  if (!id || typeof id !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    const updatedScheduleItem = await prisma.scheduleItem.updateMany({
      where: { id, userId: user.id },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedScheduleItem), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Item not found or invalid data' }), { status: 404 });
  }
}
