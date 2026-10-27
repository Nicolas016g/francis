import Link from 'next/link';
import { XCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pagamento não concluído' };

export default function CheckoutFalha() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-pitch mb-2">Pagamento não concluído</h1>
      <p className="text-pitch/60 mb-8">
        Não foi possível processar seu pagamento. Tente novamente ou escolha outra forma de pagamento.
      </p>
      <Link href="/carrinho" className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 transition-colors">
        Voltar ao carrinho
      </Link>
    </div>
  );
}
