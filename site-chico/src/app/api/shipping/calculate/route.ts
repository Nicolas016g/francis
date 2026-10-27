import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib';
import { prisma } from '@/lib/prisma';
import { createShippingQuote } from '@/lib/shipping-quote';

export interface ShippingOption {
  id: number;
  name: string;
  company: string;
  price: number;
  priceFormatted: string;
  deliveryTime: number; // dias úteis
  deliveryRange: string;
  quoteToken: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { postalCode, items } = await req.json() as {
      postalCode: string;
      items: Array<{ slug: string; qty: number }>;
    };

    const cep = postalCode.replace(/\D/g, '');
    if (cep.length !== 8) {
      return NextResponse.json({ error: 'CEP inválido.' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Nenhum item informado.' }, { status: 400 });
    }

    const token = config.shipping.melhorEnvio.token;
    if (!token) {
      return NextResponse.json(
        { error: 'Token Melhor Envio não configurado.' },
        { status: 500 }
      );
    }

    const products = await prisma.product.findMany({
      where: { slug: { in: items.map((item) => item.slug) }, active: true },
    });
    const productsBySlug = new Map(products.map((product) => [product.slug, product]));
    if (productsBySlug.size !== new Set(items.map((item) => item.slug)).size) {
      return NextResponse.json({ error: 'Um ou mais produtos não estão disponíveis.' }, { status: 400 });
    }

    let weight = 0;
    let height = 0;
    let width = 0;
    let length = 0;
    let insuranceValue = 0;
    for (const item of items) {
      const quantity = Math.floor(Number(item.qty));
      const product = productsBySlug.get(item.slug);
      if (!product || quantity < 1 || quantity > 99) {
        return NextResponse.json({ error: 'Quantidade de produto inválida.' }, { status: 400 });
      }
      weight += (product.weightGrams / 1000) * quantity;
      height = Math.max(height, product.heightCm);
      width = Math.max(width, product.widthCm);
      length += product.lengthCm * quantity;
      insuranceValue += Number(product.price) * quantity;
    }
    const pkg = {
      weight: Math.max(weight, 0.1),
      height: Math.max(height, 2),
      width: Math.max(width, 11),
      length: Math.max(length, 16),
      insuranceValue,
    };
    const baseUrl = config.shipping.melhorEnvio.sandbox
      ? 'https://sandbox.melhorenvio.com.br'
      : 'https://melhorenvio.com.br';

    const body = {
      from: { postal_code: config.shipping.melhorEnvio.fromPostalCode },
      to: { postal_code: cep },
      package: {
        height: pkg.height,
        width: pkg.width,
        length: pkg.length,
        weight: pkg.weight,
      },
      options: {
        insurance_value: pkg.insuranceValue,
        receipt: false,
        own_hand: false,
      },
    };

    const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'ChicoPimenta (contato@chicomolhos.com.br)',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Melhor Envio] Erro:', response.status, errorText);
      return NextResponse.json(
        { error: 'Erro ao consultar frete. Tente novamente.' },
        { status: 502 }
      );
    }

    const data = await response.json() as Array<{
      id: number;
      name: string;
      company: { name: string };
      price: string;
      delivery_time: number;
      delivery_range?: { min: number; max: number };
      error?: string;
    }>;

    const options: ShippingOption[] = data
      .filter((s) => !s.error)
      .map((s) => {
        const price = parseFloat(s.price ?? '0');
        const min = s.delivery_range?.min ?? s.delivery_time;
        const max = s.delivery_range?.max ?? s.delivery_time;
        const option = {
          id: s.id,
          name: s.name,
          company: s.company?.name ?? '',
          price,
          priceFormatted: price === 0 ? 'Grátis' : `R$ ${price.toFixed(2).replace('.', ',')}`,
          deliveryTime: s.delivery_time,
          deliveryRange: min === max ? `${min} dias úteis` : `${min}–${max} dias úteis`,
        };
        return {
          ...option,
          quoteToken: createShippingQuote({
            cep,
            itemKey: items
              .map((item) => `${item.slug}:${Math.floor(Number(item.qty))}`)
              .sort()
              .join('|'),
            optionId: option.id,
            price: option.price,
            service: option.name,
            deliveryDays: option.deliveryTime,
          }),
        };
      })
      .sort((a, b) => a.price - b.price);

    return NextResponse.json({ options });
  } catch (err) {
    console.error('[Melhor Envio] Exceção:', err);
    return NextResponse.json(
      { error: 'Erro interno ao calcular frete.' },
      { status: 500 }
    );
  }
}
