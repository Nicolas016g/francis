'use client';
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Carrinho() {
  const { items, removeFromCart, updateQty, total } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-pitch mb-8">
        Meu <span className="text-brand">Carrinho</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-pitch/20 mx-auto mb-4" />
          <p className="text-pitch/50 mb-4">Seu carrinho está vazio</p>
          <Link href="/pimentas" className="text-brand font-medium hover:underline">
            Explorar produtos →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lista */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.slug} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="bg-off-white rounded-xl w-16 h-16 flex items-center justify-center text-2xl shrink-0">
                  🌶️
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-pitch text-sm">{item.name}</h3>
                  <span className="text-pitch font-bold">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.slug, item.qty - 1)}
                    aria-label="Diminuir quantidade"
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.slug, item.qty + 1)}
                    aria-label="Aumentar quantidade"
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.slug)}
                  aria-label={`Remover ${item.name}`}
                  className="text-pitch/30 hover:text-red-400 transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-pitch mb-4">Resumo</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-pitch/70">
                  <span>Subtotal ({items.reduce((a, i) => a + i.qty, 0)} itens)</span>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-pitch/70">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">Calcular</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-pitch mb-6">
                <span>Total</span>
                <span className="text-pitch text-lg">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors"
              >
                Finalizar Pedido <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
