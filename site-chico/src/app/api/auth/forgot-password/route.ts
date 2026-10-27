import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

const TOKEN_TTL_MS = 30 * 60 * 1000;
const GENERIC_RESPONSE = { message: 'Se o e-mail estiver cadastrado, você receberá as instruções em instantes.' };

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  }

  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
    if (!user) return NextResponse.json(GENERIC_RESPONSE);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    const { token, tokenHash } = createPasswordResetToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
    });
    await sendPasswordResetEmail(user.email, token);
    return NextResponse.json(GENERIC_RESPONSE);
  } catch {
    return NextResponse.json({ error: 'Não foi possível enviar o e-mail agora.' }, { status: 503 });
  }
}
