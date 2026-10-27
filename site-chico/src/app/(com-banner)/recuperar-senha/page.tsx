'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { Flame } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import RedefinirSenhaForm from './RedefinirSenhaForm';

function RecuperarSenhaContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSending(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível enviar as instruções.');
      setMessage(data.message ?? 'Confira seu e-mail para continuar.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível enviar as instruções.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flame className="w-10 h-10 text-brand mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-pitch">{token ? 'Criar nova senha' : 'Recuperar senha'}</h1>
          <p className="text-pitch/60 text-sm mt-2">{token ? 'Escolha uma nova senha para sua conta.' : 'Enviaremos um link seguro para o seu e-mail.'}</p>
        </div>
        {token ? <RedefinirSenhaForm token={token} /> : <form onSubmit={handleSubmit} className="bg-white p-8 space-y-5">
          <div>
            <label htmlFor="reset-email" className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">E-mail</label>
            <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" required className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand" />
          </div>
          {error && <p role="alert" className="bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</p>}
          {message && <p role="status" className="bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</p>}
          <button type="submit" disabled={sending} className="w-full bg-brand hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 transition-colors">
            {sending ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
          <Link href="/login" className="block text-center text-sm text-brand hover:underline">Voltar para o login</Link>
        </form>}
      </div>
    </div>
  );
}

export default function RecuperarSenha() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <RecuperarSenhaContent />
    </Suspense>
  );
}
