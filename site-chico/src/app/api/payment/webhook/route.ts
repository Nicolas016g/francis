import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PaymentStatus } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

interface MercadoPagoPayment {
  id: number;
  status: 'approved' | 'pending' | 'in_process' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  external_reference?: string;
  transaction_amount?: number;
}

function mapPaymentStatus(status: MercadoPagoPayment['status']): PaymentStatus {
  if (status === 'approved') return PaymentStatus.APPROVED;
  if (['rejected', 'refunded', 'charged_back'].includes(status)) return PaymentStatus.REJECTED;
  if (status === 'cancelled') return PaymentStatus.CANCELLED;
  return PaymentStatus.PENDING;
}

function hasValidSignature(request: NextRequest, paymentId: string) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';
  const signature = request.headers.get('x-signature') ?? '';
  const requestId = request.headers.get('x-request-id') ?? '';
  const parts = Object.fromEntries(signature.split(',').map((part) => part.split('=').map((value) => value.trim())));
  if (!parts.ts || !parts.v1 || !requestId) return false;
  const manifest = `id:${paymentId};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');
  const received = Buffer.from(parts.v1, 'utf8');
  const calculated = Buffer.from(expected, 'utf8');
  return received.length === calculated.length && timingSafeEqual(received, calculated);
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return NextResponse.json({ error: 'Mercado Pago não configurado.' }, { status: 503 });

  let body: { type?: string; action?: string; data?: { id?: string } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const paymentId = body.data?.id;
  if (body.type !== 'payment' || !paymentId) return NextResponse.json({ received: true });
  if (!hasValidSignature(request, paymentId)) return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 });

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) return NextResponse.json({ error: 'Não foi possível consultar o pagamento.' }, { status: 502 });

  const payment = await response.json() as MercadoPagoPayment;
  const orderId = payment.external_reference;
  if (!orderId) return NextResponse.json({ received: true });

  const nextStatus = mapPaymentStatus(payment.status);
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });
  if (!existingOrder?.payment) return NextResponse.json({ received: true });
  if (
    existingOrder.payment.method !== 'MERCADO_PAGO' ||
    typeof payment.transaction_amount !== 'number' ||
    Math.abs(payment.transaction_amount - Number(existingOrder.total)) > 0.01
  ) {
    return NextResponse.json({ error: 'Valor do pagamento não confere com o pedido.' }, { status: 422 });
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true },
    });
    if (!order?.payment) return;
    const claimedPayment = await tx.payment.updateMany({
      where: {
        id: order.payment.id,
        status: PaymentStatus.PENDING,
        order: { status: 'PENDING' },
      },
      data: { status: nextStatus, providerPaymentId: String(payment.id) },
    });
    if (claimedPayment.count !== 1) return;

    if (nextStatus === PaymentStatus.APPROVED) {
      await tx.order.update({ where: { id: order.id }, data: { status: 'CONFIRMED' } });
    } else if (nextStatus === PaymentStatus.REJECTED || nextStatus === PaymentStatus.CANCELLED) {
      await tx.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } });
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stockQuantity: { increment: item.quantity } } });
      }
    }
  });

  return NextResponse.json({ received: true, action: body.action ?? null });
}
