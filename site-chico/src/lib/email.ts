import { Resend } from 'resend';
import { config } from '@/lib/config';

function getEmailClient() {
  if (!config.email.apiKey || !config.email.from) {
    throw new Error('Email service is not configured.');
  }
  return { resend: new Resend(config.email.apiKey), from: config.email.from };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { resend, from } = getEmailClient();
  const resetUrl = `${siteUrl}/recuperar-senha?token=${encodeURIComponent(token)}`;
  const result = await resend.emails.send({
    from,
    to: email,
    subject: 'Redefinição de senha',
    html: `<p>Recebemos um pedido para redefinir sua senha.</p><p><a href="${resetUrl}">Criar uma nova senha</a></p><p>Este link expira em 30 minutos. Se você não fez este pedido, ignore este e-mail.</p>`,
  });

  if (result.error) throw new Error(result.error.message);
}

export async function sendEmailVerificationEmail(email: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { resend, from } = getEmailClient();
  const verificationUrl = `${siteUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const result = await resend.emails.send({
    from,
    to: email,
    subject: 'Confirme seu e-mail',
    html: `<p>Olá! Confirme seu e-mail para ativar sua conta na Franci's Creative Kitchen.</p><p><a href="${verificationUrl}">Confirmar meu e-mail</a></p><p>Este link expira em 24 horas.</p>`,
  });

  if (result.error) throw new Error(result.error.message);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  const { resend, from } = getEmailClient();
  const result = await resend.emails.send({
    from,
    to: config.email.inbox,
    replyTo: data.email,
    subject: `Contato do site: ${data.subject || 'Nova mensagem'}`,
    html: `<h2>Nova mensagem pelo site</h2><p><strong>Nome:</strong> ${escapeHtml(data.name)}</p><p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p><p><strong>Assunto:</strong> ${escapeHtml(data.subject || 'Não informado')}</p><p><strong>Mensagem:</strong></p><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
  });

  if (result.error) throw new Error(result.error.message);
}
