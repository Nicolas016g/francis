'use client';
import { Flame } from 'lucide-react';
import { ProductCard } from '@/components/Product';
import Link from 'next/link';

interface Produto {
  name: string;
  price: string;
  rating: number;
  slug: string;
  tag?: string;
  ardencia: number; // 1–5
}

function ArdenciaBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Flame
          key={n}
          className={`w-4 h-4 ${n <= level ? 'text-brand fill-brand' : 'text-white/20'}`}
        />
      ))}
      <span className="text-xs text-white/50 ml-1">{level}/5</span>
    </div>
  );
}

// Wrapper that shows ardência below the card
function PimentaCard({ produto }: { produto: Produto }) {
  return (
    <div>
      <ProductCard {...produto} />
      <div className="bg-pitch/80 px-3 py-2 border-t border-brand/20">
        <ArdenciaBar level={produto.ardencia} />
      </div>
    </div>
  );
}

export default function PimentasGrid({ produtos }: { produtos: Produto[] }) {
  return (
    <>
      {/* Header branco */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-pitch mb-2">
              <span className="text-brand">Pimentas</span> Artesanais
            </h1>
            <p className="text-pitch/80 text-lg">
              Selecionadas com cuidado, conservadas com amor e muito ardor.
            </p>
          </div>

        </div>
      </div>

      {/* Grid laranja */}
      <div className="bg-brand min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtos.map((p) => (
              <PimentaCard key={p.slug} produto={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/kits" className="inline-block border-2 border-pitch text-pitch hover:bg-pitch hover:text-white font-semibold px-8 py-3 transition-colors text-sm">
              Ver Kits com Pimentas →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

