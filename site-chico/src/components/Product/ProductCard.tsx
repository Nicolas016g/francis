'use client';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

type Props = {
  name: string;
  price: string;
  rating: number;
  slug: string;
  tag?: string;
};

function parsePrice(s: string): number {
  return parseFloat(s.replace('R$', '').replace(',', '.').trim());
}

export default function ProductCard({ name, price, rating, slug, tag }: Props) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ slug, name, price: parsePrice(price) });
    toast(`${name} adicionado ao carrinho!`);
  };

  return (
    <div className="bg-white shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden group flex flex-col">
      <Link href={`/produto/${slug}`} className="block flex-1 flex flex-col">
        {/* Imagem placeholder */}
        <div className="bg-off-white h-52 relative flex-shrink-0">
          {tag && (
            <span className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2 py-1 z-10">
              {tag}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pb-2 flex-1">
          <h3 className="font-semibold text-pitch text-sm mb-1 group-hover:text-brand transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 mb-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < rating ? 'fill-brand text-brand' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 flex items-center justify-between pt-2">
        <span className="text-pitch font-bold text-base">{price}</span>
        <button
          onClick={handleAddToCart}
          aria-label={`Adicionar ${name} ao carrinho`}
          className="bg-brand hover:bg-brand-dark text-white p-2 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
