import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Preencha os campos obrigatórios: nome, e-mail e mensagem.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    // TODO: Integrar com serviço de e-mail (Resend, SendGrid, Nodemailer, etc.)
    // Exemplo com Resend:
    // await resend.emails.send({
    //   from: 'site@franciscreativekitchen.com.br',
    //   to: 'contato@chicomolhos.com.br',
    //   subject: `Contato: ${subject}`,
    //   text: `De: ${name} <${email}>\n\n${message}`,
    // });

    return NextResponse.json({ success: true, message: 'Mensagem recebida com sucesso!' });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
