'use client';

import { CreditCard, Truck, ShieldCheck, LogIn } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  PaymentMethodSelector,
  CardPaymentForm,
  PIXPaymentForm,
  type CardPaymentData,
} from "@/components/Payment";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

type PaymentMethod = 'card' | 'pix' | null;

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { total: totalAmount, items, clearCart } = useCart();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const handleCardPayment = async (data: CardPaymentData) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'card', paymentData: data, totalAmount }),
      });

      if (response.ok) {
        toast('Pagamento processado com sucesso!');
        clearCart();
      } else {
        toast('Erro ao processar pagamento. Tente novamente.', 'error');
      }
    } catch {
      toast('Erro ao processar pagamento. Tente novamente.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePixPayment = async (pixKey: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'pix', pixKey, totalAmount }),
      });

      if (response.ok) {
        toast('PIX confirmado! Aguardando pagamento.');
        clearCart();
      } else {
        toast('Erro ao confirmar PIX. Tente novamente.', 'error');
      }
    } catch {
      toast('Erro ao confirmar PIX. Tente novamente.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {!isLoggedIn ? (
        <div className="text-center py-20">
          <LogIn className="w-12 h-12 text-brand mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-pitch mb-2">Login necessário</h2>
          <p className="text-pitch/60 mb-6">Faça login ou crie uma conta para finalizar seu pedido.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="border-2 border-brand text-brand hover:bg-brand hover:text-white font-semibold px-8 py-3 transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      ) : (
      <>
      <h1 className="text-3xl font-bold text-pitch mb-2">
        Finalizar <span className="text-brand">Pedido</span>
      </h1>
      <p className="text-pitch/60 mb-8 text-sm flex items-center gap-1">
        <ShieldCheck className="w-4 h-4 text-green-500" /> Ambiente seguro e criptografado
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-2 space-y-6">
          {/* Endereço */}
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand" /> Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["CEP", "Rua", "Número", "Complemento", "Bairro", "Cidade", "Estado"].map((f) => (
                <div key={f} className={f === "Rua" || f === "Complemento" ? "md:col-span-2" : ""}>
                  <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">{f}</label>
                  <input
                    type="text"
                    placeholder={f}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand" /> Forma de Pagamento
            </h2>

            {/* Seletor de Método */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />

            {/* Formulários específicos por método */}
            {paymentMethod === 'card' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <CardPaymentForm
                  onSubmit={handleCardPayment}
                  isLoading={isProcessing}
                />
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <PIXPaymentForm
                  totalAmount={totalAmount}
                  onSubmit={handlePixPayment}
                  isLoading={isProcessing}
                />
              </div>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-sm p-6 sticky top-20">
            <h2 className="font-bold text-pitch mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between text-pitch/70">
                  <span className="truncate pr-2">{item.name} × {item.qty}</span>
                  <span className="shrink-0">R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
              <div className="flex justify-between text-pitch/70">
                <span>Frete</span>
                <span className="text-pitch">Calcular</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-pitch mb-6">
              <span>Total</span>
              <span className="text-brand text-lg">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
            </div>
            {!paymentMethod && (
              <p className="text-center text-sm text-pitch/60 py-3 bg-gray-50">
                Selecione um método de pagamento
              </p>
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
