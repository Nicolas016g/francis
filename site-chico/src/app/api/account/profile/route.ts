import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });

  try {
    const body = await request.json() as { name?: string; email?: string; phone?: string };
    const name = body.name?.trim() ?? '';
    const email = body.email?.trim().toLowerCase() ?? '';
    const phone = body.phone?.trim() || null;

    if (name.length < 2 || name.length > 100) return NextResponse.json({ error: 'Informe um nome válido.' }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    if (phone && phone.length > 30) return NextResponse.json({ error: 'Informe um telefone válido.' }, { status: 400 });

    const duplicate = await prisma.user.findFirst({ where: { email, id: { not: userId } } });
    if (duplicate) return NextResponse.json({ error: 'Este e-mail já está em uso.' }, { status: 409 });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, phone },
      select: { id: true, name: true, email: true, phone: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Não foi possível salvar seus dados.' }, { status: 500 });
  }
}
