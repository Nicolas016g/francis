'use client';
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { ProductCard } from '@/components/Product';

interface Produto {
  name: string;
  price: string;
  rating: number;
  slug: string;
  tag?: string;
  tipo: string;
}

const FILTERS = ['Todos', 'Clássico', 'Defumado', 'Especial'] as const;

export default function MolhosGrid({ produtos }: { produtos: Produto[] }) {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filtered =
    activeFilter === 'Todos' ? produtos : produtos.filter((p) => p.tipo === activeFilter);

  return (
    <>
      {/* Header branco */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-pitch mb-2">
              <span className="text-brand">Molhos</span> Autorais
            </h1>
            <p className="text-pitch/80 text-lg">
              Receitas únicas, desenvolvidas com ingredientes selecionados para quem leva sabor a sério.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-pitch/50" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium border transition-colors ${
                  activeFilter === f
                    ? 'bg-brand text-white border-brand'
                    : 'border-brand/20 text-pitch/70 hover:border-brand hover:text-brand'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid laranja */}
      <div className="bg-brand min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <p className="text-white/70 text-center py-20">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
