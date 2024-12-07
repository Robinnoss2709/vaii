import prisma from '../../../lib/prisma/prisma';

export async function GET() {
  const scheduleItems = await prisma.scheduleItem.findMany();
  return new Response(JSON.stringify(scheduleItems));
}

export async function POST({ request }) {
  const data = await request.json();
  const scheduleItem = await prisma.scheduleItem.create({
    data: {
      ...data,
      color: data.color || 'bg-gray-400' // Použitie predvolenej farby, ak nie je zadaná
    }
  });
  return new Response(JSON.stringify(scheduleItem));
}


export async function DELETE({ url }) {
  const id = url.searchParams.get('id');

  if (!id || isNaN(parseInt(id, 10))) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    await prisma.scheduleItem.delete({ where: { id: parseInt(id, 10) } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
  }
}


export async function PATCH({ request }) {
  const data = await request.json();

  const { id, ...updateData } = data;

  if (!id || typeof id !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    const updatedScheduleItem = await prisma.scheduleItem.update({
      where: { id },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedScheduleItem), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Item not found or invalid data' }), { status: 404 });
  }
}