import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ error: 'Faça login para avaliar.' }, { status: 401 });

  const { slug } = await params;
  try {
    const body = await request.json() as { rating?: number; comment?: string };
    const rating = Number(body.rating);
    const comment = body.comment?.trim() ?? '';
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'A nota deve estar entre 1 e 5.' }, { status: 400 });
    }
    if (comment.length < 3 || comment.length > 1000) {
      return NextResponse.json({ error: 'Escreva uma avaliação entre 3 e 1000 caracteres.' }, { status: 400 });
    }

    const product = await prisma.product.findFirst({ where: { slug, active: true }, select: { id: true } });
    if (!product) return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });

    const review = await prisma.review.upsert({
      where: { userId_productId: { userId, productId: product.id } },
      create: { userId, productId: product.id, rating, comment },
      update: { rating, comment },
      select: { id: true, rating: true, comment: true, createdAt: true },
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Não foi possível salvar a avaliação.' }, { status: 500 });
  }
}
