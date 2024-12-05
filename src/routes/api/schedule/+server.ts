import prisma from '../../../lib/prisma/prisma'; // Predpokladáme, že Prisma Client je inicializovaný v $lib/prisma.ts

export async function GET() {
  const scheduleItems = await prisma.scheduleItem.findMany();
  return new Response(JSON.stringify(scheduleItems));
}

export async function POST({ request }) {
  const data = await request.json();
  const scheduleItem = await prisma.scheduleItem.create({ data });
  return new Response(JSON.stringify(scheduleItem));
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  await prisma.scheduleItem.delete({ where: { id } });
  return new Response(JSON.stringify({ success: true }));
}