import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...product,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() ?? null,
      inStock: product.stockQuantity > 0,
    },
  });
}
