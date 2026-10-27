import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Muitas mensagens. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  try {
    const body = await req.json() as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
    };
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Preencha os campos obrigatórios: nome, e-mail e mensagem.' },
        { status: 400 }
      );
    }
    if (name.length > 100 || subject.length > 150 || message.length > 5000) {
      return NextResponse.json({ error: 'Um ou mais campos excedem o limite permitido.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 254 || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({ success: true, message: 'Mensagem recebida com sucesso!' });
  } catch (error) {
    console.error('[Contact] Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
