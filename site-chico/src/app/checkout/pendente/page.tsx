import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pagamento Pendente' };

export default function CheckoutPendente() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-pitch mb-2">Pagamento pendente</h1>
      <p className="text-pitch/60 mb-8">
        Seu pagamento está sendo processado. Acompanhe a atualização do pedido na sua conta.
      </p>
      <Link href="/minha-conta" className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 transition-colors">
        Acompanhar pedido
      </Link>
    </div>
  );
}
