'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setVerificationStatus(new URLSearchParams(window.location.search).get('verified'));
  }, []);

  const handleResend = async () => {
    setResendMessage('');
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json() as { message?: string; error?: string };
    setResendMessage(data.message ?? data.error ?? 'Confira seu e-mail.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      const requested = new URLSearchParams(window.location.search).get('redirect') ?? '';
      const isInternalPath = requested.startsWith('/') && !requested.startsWith('//') && !requested.includes('\\');
      router.push(isInternalPath ? requested : '/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flame className="w-10 h-10 text-brand mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-pitch">Bem-vindo de volta</h1>
          <p className="text-pitch/60 text-sm mt-2">Entre na sua conta Franci&apos;s</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <Link href="/recuperar-senha" className="text-xs text-brand hover:underline font-medium">
              Esqueci minha senha
            </Link>
          </div>

          {error && <p role="alert" className="bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</p>}
          {verificationStatus === 'success' && <p role="status" className="bg-green-50 text-green-700 px-4 py-3 text-sm">E-mail confirmado. Agora você pode entrar.</p>}
          {verificationStatus === 'expired' && <p role="alert" className="bg-red-50 text-red-700 px-4 py-3 text-sm">Este link expirou. Informe seu e-mail abaixo para receber outro.</p>}
          {verificationStatus === 'invalid' && <p role="alert" className="bg-red-50 text-red-700 px-4 py-3 text-sm">Link de confirmação inválido.</p>}
          {error.includes('Confirme seu e-mail') && <button type="button" onClick={handleResend} className="text-xs text-brand hover:underline">Reenviar confirmação</button>}
          {resendMessage && <p role="status" className="text-sm text-pitch/70">{resendMessage}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-brand hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 transition-colors">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-pitch/40 font-medium">OU</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-pitch/70 mb-3">
            Não tem uma conta?
          </p>
          <Link
            href="/cadastro"
            className="block w-full border-2 border-brand text-brand hover:bg-brand hover:text-white text-sm font-semibold py-3 transition-colors"
          >
            Criar nova conta
          </Link>
        </div>

        <p className="text-center text-xs text-pitch/50 mt-8">
          Ao continuar, você concorda com os nossos{" "}
          <Link href="/termos" className="text-brand hover:underline">Termos de Uso</Link>
          {" e "}
          <Link href="/privacidade" className="text-brand hover:underline">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
