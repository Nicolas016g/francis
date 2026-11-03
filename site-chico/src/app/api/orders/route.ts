import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PaymentMethod } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';
import { verifyShippingQuote } from '@/lib/shipping-quote';
import { applyStockChange } from '@/lib/stock';
import { config } from '@/lib';

type OrderBody = {
  checkoutKey?: string;
  items?: Array<{ slug?: string; quantity?: number }>;
  shippingCost?: number;
  shippingService?: string;
  deliveryDays?: number;
  shippingQuote?: string;
  address?: {
    recipientName?: string;
    recipientPhone?: string;
    postalCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  paymentMethod?: 'MERCADO_PAGO' | 'PIX';
};

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ error: 'Faça login para consultar seus pedidos.' }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: { select: { name: true, slug: true } } } }, payment: true },
  });
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ error: 'Faça login para finalizar o pedido.' }, { status: 401 });

  try {
    const body = await request.json() as OrderBody;
    if (!config.payment.mercadoPago.accessToken) {
      return NextResponse.json({ error: 'Pagamento indisponível no momento. Tente novamente mais tarde.' }, { status: 503 });
    }
    const checkoutKey = body.checkoutKey?.trim();
    if (!checkoutKey || checkoutKey.length < 16 || checkoutKey.length > 100) {
      return NextResponse.json({ error: 'Identificador de checkout inválido.' }, { status: 400 });
    }
    const items = body.items ?? [];
    const address = body.address;
    if (!items.length || !address?.recipientName || !address.postalCode || !address.street || !address.number || !address.neighborhood || !address.city || !address.state) {
      return NextResponse.json({ error: 'Itens e endereço completo são obrigatórios.' }, { status: 400 });
    }
    const normalizedItems = items.map((item) => ({ slug: item.slug?.trim() ?? '', quantity: Math.floor(Number(item.quantity)) }));
    if (normalizedItems.some((item) => !item.slug || item.quantity < 1 || item.quantity > 99)) return NextResponse.json({ error: 'Quantidade de produto inválida.' }, { status: 400 });
    const shippingQuote = verifyShippingQuote(body.shippingQuote);
    const itemKey = normalizedItems
      .map((item) => `${item.slug}:${item.quantity}`)
      .sort()
      .join('|');
    if (
      !shippingQuote ||
      shippingQuote.cep !== address.postalCode.replace(/\D/g, '') ||
      shippingQuote.itemKey !== itemKey
    ) {
      return NextResponse.json({ error: 'A cotação do frete expirou. Calcule novamente.' }, { status: 400 });
    }
    const shippingCost = shippingQuote.price;
    const paymentMethod = body.paymentMethod ?? 'MERCADO_PAGO';
    if (paymentMethod !== 'MERCADO_PAGO') return NextResponse.json({ error: 'Este método de pagamento está indisponível.' }, { status: 503 });
    if (!Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)) return NextResponse.json({ error: 'Método de pagamento inválido.' }, { status: 400 });

    const uniqueSlugs = [...new Set(normalizedItems.map((item) => item.slug))];
    if (uniqueSlugs.length !== normalizedItems.length) return NextResponse.json({ error: 'Não repita produtos no pedido.' }, { status: 400 });

    const products = await prisma.product.findMany({ where: { slug: { in: uniqueSlugs }, active: true } });
    if (products.length !== uniqueSlugs.length) return NextResponse.json({ error: 'Um ou mais produtos não estão disponíveis.' }, { status: 400 });
    const productMap = new Map(products.map((product) => [product.slug, product]));
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 401 });
    const existingOrder = await prisma.order.findFirst({
      where: { checkoutKey, userId },
      include: { items: true, payment: true },
    });
    if (existingOrder) {
      if (existingOrder.status !== 'PENDING' || existingOrder.payment?.status !== 'PENDING') {
        return NextResponse.json({ error: 'Este checkout já foi finalizado.' }, { status: 409 });
      }
      return NextResponse.json({ order: existingOrder }, { status: 200 });
    }
    const recipientName = address.recipientName.trim();
    const postalCode = address.postalCode.trim();
    const street = address.street.trim();
    const number = address.number.trim();
    const neighborhood = address.neighborhood.trim();
    const city = address.city.trim();
    const state = address.state.trim().toUpperCase();
    for (const item of normalizedItems) {
      const product = productMap.get(item.slug);
      if (!product || product.stockQuantity < item.quantity) return NextResponse.json({ error: `Estoque insuficiente para ${product?.name ?? item.slug}.` }, { status: 409 });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + Number(productMap.get(item.slug)!.price) * item.quantity, 0);
    const total = subtotal + shippingCost;
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          checkoutKey, userId, status: 'PENDING', paymentMethod: paymentMethod as PaymentMethod,
          subtotal, shippingCost, total, shippingService: shippingQuote.service, deliveryDays: shippingQuote.deliveryDays,
          recipientName, recipientEmail: user.email, recipientPhone: address.recipientPhone,
          postalCode, street, number, complement: address.complement,
          neighborhood, city, state,
          items: { create: normalizedItems.map((item) => ({ productId: productMap.get(item.slug)!.id, quantity: item.quantity, unitPrice: productMap.get(item.slug)!.price })) },
          payment: { create: { method: paymentMethod as PaymentMethod, amount: total } },
        },
        include: { items: true, payment: true },
      });
      for (const item of normalizedItems) {
        const balance = await applyStockChange(tx, {
          productId: productMap.get(item.slug)!.id,
          delta: -item.quantity,
          reason: 'ORDER_RESERVED',
          orderId: created.id,
        });
        if (balance === null) throw new Error('STOCK_CONFLICT');
      }
      return created;
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'STOCK_CONFLICT') return NextResponse.json({ error: 'O estoque mudou. Revise seu carrinho.' }, { status: 409 });
    if (error instanceof Error && error.message.includes('Order_checkoutKey_key')) {
      return NextResponse.json({ error: 'Este checkout já está sendo processado. Tente novamente.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Não foi possível criar o pedido.' }, { status: 500 });
  }
}
