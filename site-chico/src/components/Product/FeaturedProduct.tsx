'use client';

import { Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface FeaturedProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  rating?: number;
  inStock?: boolean;
}

export default function FeaturedProduct({
  id,
  name,
  description,
  price,
  image,
  badge,
  rating,
  inStock = true,
}: FeaturedProductProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({ slug: id, name, price });
    toast(`${name} adicionado ao carrinho!`);
  };
  return (
    <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Badge de Destaque */}
      {badge && (
        <div className="absolute top-4 left-4 z-20 bg-brand text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
          {badge}
        </div>
      )}

      {/* Imagem */}
      <div className="relative h-80 w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20 z-10 group-hover:from-black/10 group-hover:to-black/40 transition-all duration-300" />
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-1">
        {/* Avaliação */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-brand text-brand'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-pitch/60 ml-1">({rating})</span>
          </div>
        )}

        {/* Nome */}
        <h3 className="text-lg font-bold text-pitch mb-1 line-clamp-2 group-hover:text-brand transition-colors">
          {name}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-pitch/60 mb-4 line-clamp-2 flex-1">{description}</p>

        {/* Preço */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-pitch">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Botão */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={`Adicionar ${name} ao carrinho`}
          className="w-full bg-white border-2 border-brand text-pitch font-semibold py-3 transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:bg-brand hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          Adicionar ao Carrinho
        </button>
      </div>

      {/* Barra de destaque na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-brand-light to-brand scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300" />
    </div>
  );
}