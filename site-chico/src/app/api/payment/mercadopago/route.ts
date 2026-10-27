import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from '@/lib';
import { cookies } from 'next/headers';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface CreatePreferenceBody {
  orderId?: string;
}

export async function POST(req: NextRequest) {
  const accessToken = config.payment.mercadoPago.accessToken;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Pagamento indisponível no momento. Tente mais tarde.' },
      { status: 503 }
    );
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });

  let body: CreatePreferenceBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const { orderId } = body;
  if (!orderId) return NextResponse.json({ error: 'Pedido não informado.' }, { status: 400 });
  const order = await prisma.order.findFirst({ where: { id: orderId, userId, status: 'PENDING' }, include: { items: { include: { product: true } } } });
  if (!order || !order.items.length) return NextResponse.json({ error: 'Pedido não encontrado ou inválido.' }, { status: 404 });

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const baseUrl = config.api.baseUrl;
  const internalOrderId = order.id;

  try {
    const result = await preference.create({
      body: {
        external_reference: internalOrderId,
        items: order.items.map((item) => ({
          id: item.product.slug,
          title: item.product.name,
          quantity: item.quantity,
          unit_price: Number(item.unitPrice),
          currency_id: 'BRL',
        })),
        payer: { email: order.recipientEmail },
        shipments: Number(order.shippingCost) > 0
          ? { cost: Number(order.shippingCost), mode: 'not_specified' }
          : undefined,
        payment_methods: {
          excluded_payment_types: [],
          installments: 6,
        },
        back_urls: {
          success: `${baseUrl}/checkout/sucesso`,
          failure: `${baseUrl}/checkout/falha`,
          pending: `${baseUrl}/checkout/pendente`,
        },
        auto_return: 'approved',
      },
      requestOptions: {
        idempotencyKey: `checkout-preference:${order.id}`,
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
      orderId: internalOrderId,
    });
  } catch (err) {
    console.error('[Mercado Pago] Erro ao criar preferência:', err);
    return NextResponse.json(
      { error: 'Não foi possível confirmar o pagamento agora. Tente novamente; seu pedido foi preservado.', orderId: order.id },
      { status: 502 }
    );
  }
}
