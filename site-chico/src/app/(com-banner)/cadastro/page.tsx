'use client';
import { useState } from 'react';
import Link from "next/link";
import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    login(name, email);
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flame className="w-10 h-10 text-brand mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-pitch">Crie sua conta</h1>
          <p className="text-pitch/60 text-sm mt-2">Junte-se à comunidade Franci's</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
          </div>

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

          <div>
            <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
              Confirme a senha
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" className="mt-1" required />
            <label htmlFor="terms" className="text-xs text-pitch/70">
              Concordo com os{" "}
              <Link href="/termos" className="text-brand hover:underline font-medium">
                Termos de Uso
              </Link>
              {" e "}
              <Link href="/privacidade" className="text-brand hover:underline font-medium">
                Política de Privacidade
              </Link>
            </label>
          </div>

          <button type="submit" className="w-full bg-brand hover:bg-orange-600 text-white font-semibold py-3 transition-colors">
            Criar conta
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-pitch/40 font-medium">OU</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-pitch/70 mb-3">
            Já tem uma conta?
          </p>
          <Link
            href="/login"
            className="block w-full border-2 border-brand text-brand hover:bg-brand hover:text-white text-sm font-semibold py-3 transition-colors"
          >
            Entrar agora
          </Link>
        </div>

        <p className="text-center text-xs text-pitch/50 mt-8">
          Ao continuar, você concorda com os nossos{" "}
          <a href="#" className="text-brand hover:underline">Termos de Uso</a>.
        </p>
      </div>
    </div>
  );
}
