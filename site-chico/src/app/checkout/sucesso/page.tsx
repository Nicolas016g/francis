import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pedido Confirmado' };

export default function CheckoutSucesso() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-pitch mb-2">Pedido confirmado!</h1>
      <p className="text-pitch/60 mb-8">
        Seu pagamento foi aprovado. Você receberá a confirmação por e-mail em breve.
      </p>
      <Link href="/" className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 transition-colors">
        Continuar comprando
      </Link>
    </div>
  );
}
