import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    // TODO: Integrar com API real de PIX (Braspag, Mercado Pago, etc)
    // Por agora, vou criar um mock com dados de exemplo

    // Exemplo de chave PIX (você colocará a chave real do cliente)
    const pixKey = 'chave-pix-aleatoria-123456789';

    // TODO: Gerar QR Code real usando biblioteca como 'qrcode'
    // Para agora, vou usar um placeholder
    const mockQRCodeBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    return NextResponse.json({
      success: true,
      pixKey,
      qrCode: mockQRCodeBase64,
      amount,
      expiresIn: 1800, // 30 minutos
    });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao gerar QR Code PIX' },
      { status: 500 }
    );
  }
}
