import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPasswordResetToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim() ?? '';
  if (!token) return NextResponse.redirect(new URL('/login?verified=invalid', request.url));

  const verification = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashPasswordResetToken(token) },
  });

  if (!verification || verification.usedAt || verification.expiresAt <= new Date()) {
    return NextResponse.redirect(new URL('/login?verified=expired', request.url));
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: verification.userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.emailVerificationToken.update({ where: { id: verification.id }, data: { usedAt: new Date() } }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: verification.userId, id: { not: verification.id } } }),
  ]);

  return NextResponse.redirect(new URL('/login?verified=success', request.url));
}
