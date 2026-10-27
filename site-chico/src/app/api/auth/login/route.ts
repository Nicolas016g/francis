import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, verifyPassword, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  }
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Informe e-mail e senha.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const validPassword = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !validPassword) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
    }
    if (!user.emailVerifiedAt) {
      return NextResponse.json({ error: 'Confirme seu e-mail antes de entrar.', code: 'EMAIL_NOT_VERIFIED' }, { status: 403 });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: 'Não foi possível entrar agora.' }, { status: 500 });
  }
}
