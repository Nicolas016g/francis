import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { createEmailVerificationToken } from '@/lib/auth';
import { sendEmailVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`verify-email:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429 });

  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, emailVerifiedAt: true } });
    const generic = { message: 'Se a conta existir e ainda não estiver confirmada, enviaremos um novo link.' };
    if (!user || user.emailVerifiedAt) return NextResponse.json(generic);

    await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    const { token, tokenHash } = createEmailVerificationToken();
    await prisma.emailVerificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    await sendEmailVerificationEmail(user.email, token);
    return NextResponse.json(generic);
  } catch {
    return NextResponse.json({ error: 'Não foi possível reenviar o e-mail agora.' }, { status: 503 });
  }
}
