import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated Mercado Pago foi descontinuado. Use apenas PIX e Cartão.
 * Esta rota será removida em versão futura.
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Mercado Pago descontinuado. Use PIX ou Cartão.' },
    { status: 410 }
  );
}
