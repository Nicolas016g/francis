'use client';
import { useState } from 'react';
import { Star, MessageSquarePlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function HomeReviewSection() {
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast('Selecione uma nota antes de enviar.', 'error');
      return;
    }
    if (text.trim().length < 10) {
      toast('Escreva ao menos 10 caracteres na sua opinião.', 'error');
      return;
    }
    // TODO: salvar avaliação no banco de dados
    toast(`Obrigado, ${user?.name ?? name}! Sua opinião foi registrada.`);
    setRating(0);
    setText('');
    setName('');
  };

  return (
    <section className="py-16 px-4 bg-pitch">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquarePlus className="w-7 h-7 text-brand" />
          <h2 className="text-3xl font-bold text-white">
            Deixe sua <span className="text-brand">opinião</span>
          </h2>
        </div>
        <p className="text-white/60 mb-8 text-sm">
          Sua avaliação ajuda outros clientes a escolherem melhor.
        </p>

        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="bg-black/30 border border-white/10 p-6 space-y-4">
            <p className="text-white/70 text-sm">
              Avaliando como <span className="text-brand font-semibold">{user?.name}</span>
            </p>

            {/* Estrelas */}
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Nota geral
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        n <= (hovered || rating)
                          ? 'fill-brand text-brand'
                          : 'text-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Texto */}
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Sua opinião
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Conte sua experiência com nossos produtos..."
                className="w-full bg-black/20 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 text-sm transition-colors"
            >
              Enviar Opinião
            </button>
          </form>
        ) : (
          <div className="bg-black/30 border border-white/10 p-8 text-center">
            <LogIn className="w-10 h-10 text-brand mx-auto mb-4" />
            <p className="text-white mb-2 font-semibold">Faça login para deixar sua opinião</p>
            <p className="text-white/50 text-sm mb-6">
              Somente clientes cadastrados podem avaliar nossos produtos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 text-sm transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="border border-white/20 hover:border-brand text-white/80 hover:text-white font-semibold px-8 py-3 text-sm transition-colors"
              >
                Criar conta
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
