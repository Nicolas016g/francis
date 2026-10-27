import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { hasValidMaintenanceSecret } from '@/lib/maintenance-auth';

const DEFAULT_EXPIRATION_MINUTES = 30;
const MAX_EXPIRATION_MINUTES = 24 * 60;
const MAX_BATCH_SIZE = 100;

function getExpirationMinutes(request: NextRequest) {
  const value = Number(request.nextUrl.searchParams.get('minutes') ?? DEFAULT_EXPIRATION_MINUTES);
  if (!Number.isInteger(value) || value < 5 || value > MAX_EXPIRATION_MINUTES) return null;
  return value;
}

export async function POST(request: NextRequest) {
  try {
    if (!hasValidMaintenanceSecret(request)) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const expirationMinutes = getExpirationMinutes(request);
    if (expirationMinutes === null) {
      return NextResponse.json({ error: 'O parâmetro minutes deve estar entre 5 e 1440.' }, { status: 400 });
    }

    const cutoff = new Date(Date.now() - expirationMinutes * 60 * 1000);
    const candidates = await prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        createdAt: { lt: cutoff },
        payment: { status: PaymentStatus.PENDING },
      },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
      take: MAX_BATCH_SIZE,
    });

    let expired = 0;
    for (const candidate of candidates) {
      const released = await prisma.$transaction(async (tx) => {
        const claimedPayment = await tx.payment.updateMany({
          where: {
            orderId: candidate.id,
            status: PaymentStatus.PENDING,
            order: { status: OrderStatus.PENDING },
          },
          data: { status: PaymentStatus.CANCELLED },
        });
        if (claimedPayment.count !== 1) return false;

        const cancelledOrder = await tx.order.updateMany({
          where: { id: candidate.id, status: OrderStatus.PENDING },
          data: { status: OrderStatus.CANCELLED },
        });
        if (cancelledOrder.count !== 1) {
          throw new Error('ORDER_STATE_CHANGED');
        }

        const items = await tx.orderItem.findMany({
          where: { orderId: candidate.id },
          select: { productId: true, quantity: true },
        });
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
        return true;
      });
      if (released) expired += 1;
    }

    return NextResponse.json({
      expired,
      scanned: candidates.length,
      hasMore: candidates.length === MAX_BATCH_SIZE,
      cutoff: cutoff.toISOString(),
    });
  } catch (error) {
    console.error('[Expire orders] Erro ao expirar pedidos:', error);
    return NextResponse.json({ error: 'Não foi possível expirar os pedidos agora.' }, { status: 500 });
  }
}
