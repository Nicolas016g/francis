'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const CONTATO = {
  whatsapp: '551696369876',
  phone: '(16) 99636-9876',
  email: 'contato@chicomolhos.com.br',
  instagram: 'francis.molhos',
};

export default function Contato() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast('Mensagem enviada com sucesso!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast(data.error || 'Erro ao enviar mensagem.', 'error');
      }
    } catch {
      toast('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Header branco */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative h-24 w-48 mx-auto mb-8">
            <Image
              src="/logo_entreemcontato.png"
              alt="Franci's Creative Kitchen"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-pitch mb-3">
            Fale <span className="text-brand">Conosco</span>
          </h1>
          <p className="text-pitch/80 text-lg">Estamos aqui para ajudar. Escolha o canal que preferir.</p>
        </div>
      </div>

      {/* Conteúdo laranja */}
      <div className="bg-brand min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {[
              {
                icon: <MessageCircle className="w-6 h-6 text-green-500" />,
                title: 'WhatsApp',
                desc: 'Resposta rápida, fale direto conosco',
                action: 'Chamar no WhatsApp',
                href: `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de mais informações.')}`,
                color: 'hover:border-green-400',
              },
              {
                icon: <Phone className="w-6 h-6 text-brand" />,
                title: 'Telefone',
                desc: CONTATO.phone,
                action: 'Ligar agora',
                href: `tel:+${CONTATO.whatsapp}`,
                color: 'hover:border-brand',
              },
              {
                icon: <Mail className="w-6 h-6 text-brand" />,
                title: 'E-mail',
                desc: CONTATO.email,
                action: 'Enviar e-mail',
                href: `mailto:${CONTATO.email}`,
                color: 'hover:border-brand',
              },
              {
                icon: <Instagram className="w-6 h-6 text-pink-500" />,
                title: 'Instagram',
                desc: `@${CONTATO.instagram}`,
                action: 'Seguir no Instagram',
                href: `https://instagram.com/${CONTATO.instagram}`,
                color: 'hover:border-pink-400',
              },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href}
                className={`bg-white border border-gray-100 p-6 flex items-start gap-4 shadow hover:shadow-md transition-all ${c.color} border-2`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="mt-1">{c.icon}</div>
                <div>
                  <h3 className="font-bold text-pitch mb-1">{c.title}</h3>
                  <p className="text-pitch/60 text-sm mb-2">{c.desc}</p>
                  <span className="text-brand text-sm font-medium">{c.action} →</span>
                </div>
              </a>
            ))}
          </div>

          {/* Formulário */}
          <div className="bg-white p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-pitch mb-6">Envie uma mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome *"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Seu e-mail *"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                />
              </div>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Assunto"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
              />
              <textarea
                rows={4}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Sua mensagem... *"
                required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-brand hover:bg-brand/90 text-white font-semibold px-6 py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
