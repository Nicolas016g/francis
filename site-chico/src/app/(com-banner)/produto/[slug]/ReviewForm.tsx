'use client';
import { useState } from 'react';
import { Star, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ReviewForm({ productSlug }: { productSlug: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast('Selecione uma nota antes de enviar.', 'error');
      return;
    }
    // TODO: enviar avaliação para API
    void productSlug;
    toast(`Obrigado, ${user?.name}! Avaliação enviada com sucesso.`);
    setRating(0);
    setText('');
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-off-white p-6 text-center">
        <LogIn className="w-8 h-8 text-brand mx-auto mb-3" />
        <h3 className="font-bold text-pitch mb-2">Faça login para avaliar</h3>
        <p className="text-sm text-pitch/60 mb-4">
          Somente clientes cadastrados podem deixar avaliações.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 text-sm transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="border border-brand text-brand hover:bg-brand hover:text-white font-semibold px-6 py-2.5 text-sm transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white p-6">
      <h3 className="font-bold text-pitch mb-1">Deixe sua avaliação</h3>
      <p className="text-xs text-pitch/50 mb-4">Avaliando como <span className="text-brand font-semibold">{user?.name}</span></p>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-4">
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
                className={`w-6 h-6 transition-colors ${
                  n <= (hovered || rating)
                    ? 'fill-brand text-brand'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Conte sua experiência com o produto..."
          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none mb-3"
        />
        <button
          type="submit"
          className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 text-sm transition-colors"
        >
          Enviar Avaliação
        </button>
      </form>
    </div>
  );
}

