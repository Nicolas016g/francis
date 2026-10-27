import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, hashPasswordResetToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`reset:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429 });

  try {
    const body = await request.json() as { token?: string; password?: string };
    const token = body.token?.trim() ?? '';
    const password = body.password ?? '';
    if (!token || password.length < 8) return NextResponse.json({ error: 'Token inválido ou senha muito curta.' }, { status: 400 });

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashPasswordResetToken(token) } });
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      return NextResponse.json({ error: 'Este link expirou ou já foi utilizado.' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash: await hashPassword(password) } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId, id: { not: resetToken.id } } }),
    ]);

    return NextResponse.json({ message: 'Senha redefinida com sucesso.' });
  } catch {
    return NextResponse.json({ error: 'Não foi possível redefinir a senha.' }, { status: 500 });
  }
}
