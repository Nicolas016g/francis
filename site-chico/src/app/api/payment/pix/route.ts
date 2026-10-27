import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'PIX indisponível até a integração com o provedor.' }, { status: 503 });
}
