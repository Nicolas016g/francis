import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createEmailVerificationToken, hashPassword } from '@/lib/auth';
import { sendEmailVerificationEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  }
  try {
    const body = await request.json() as { name?: string; email?: string; password?: string };
    const name = body.name?.trim() ?? '';
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Informe seu nome completo.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: { name, email, passwordHash: await hashPassword(password) },
      select: { id: true, name: true, email: true },
    });
    const { token, tokenHash } = createEmailVerificationToken();
    await prisma.emailVerificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    await sendEmailVerificationEmail(user.email, token);
    return NextResponse.json({ requiresEmailVerification: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Não foi possível criar sua conta agora.' }, { status: 500 });
  }
}
