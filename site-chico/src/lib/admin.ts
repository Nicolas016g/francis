import { cache } from 'react';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const getCurrentAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return { admin: null, authenticated: false };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, emailVerifiedAt: true },
  });
  const isAdmin = user?.role === 'ADMIN' && Boolean(user.emailVerifiedAt);
  return { admin: isAdmin ? user : null, authenticated: true };
});

/** Use em páginas e ações do painel: exige login e papel de administrador. */
export async function requireAdmin() {
  const { admin, authenticated } = await getCurrentAdmin();
  if (!authenticated) redirect('/login?redirect=/admin');
  if (!admin) notFound();
  return admin;
}
