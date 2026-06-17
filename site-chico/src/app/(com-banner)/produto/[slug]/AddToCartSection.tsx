'use client';
import { useState } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface Props {
  slug: string;
  name: string;
  price: number;
}

export default function AddToCartSection({ slug, name, price }: Props) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addToCart({ slug, name, price }, qty);
    toast(`${qty}x ${name} adicionado${qty > 1 ? 's' : ''} ao carrinho!`);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center border border-gray-200 overflow-hidden">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Diminuir quantidade"
          className="px-3 py-3 hover:bg-off-white transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 font-medium min-w-[2rem] text-center">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          aria-label="Aumentar quantidade"
          className="px-3 py-3 hover:bg-off-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" /> Adicionar ao Carrinho
      </button>
    </div>
  );
}
