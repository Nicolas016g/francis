import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true },
  });
  return NextResponse.json({ user });
}
