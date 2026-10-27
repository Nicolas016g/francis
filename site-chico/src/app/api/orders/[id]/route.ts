import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ error: 'Faça login para consultar o pedido.' }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: { include: { product: true } }, payment: true },
  });
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 });
  return NextResponse.json({ order });
}
