import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { method, paymentData, pixKey, totalAmount } = await req.json();

    if (method === 'card') {
      // TODO: Integrar com processador de cartões (Stripe, PagSeguro, etc.)
      return NextResponse.json({
        success: true,
        message: 'Pagamento com cartão processado',
        orderId: 'ORD-' + Date.now(),
      });
    }

    if (method === 'pix') {
      void pixKey; void totalAmount;
      // TODO: Registrar PIX no banco de dados
      return NextResponse.json({
        success: true,
        message: 'PIX registrado com sucesso',
        orderId: 'ORD-' + Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Método de pagamento inválido. Use card ou pix.' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
