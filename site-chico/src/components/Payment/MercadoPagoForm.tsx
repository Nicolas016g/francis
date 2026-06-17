'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface MercadoPagoFormProps {
  totalAmount: number;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function MercadoPagoForm({
  totalAmount,
  onSubmit,
  isLoading = false,
}: MercadoPagoFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    'credit_card' | 'debit_card' | 'ticket' | 'account_money'
  >('credit_card');

  const methods = [
    {
      id: 'credit_card',
      label: 'Cartão de Crédito',
      description: 'Crédito com parcelamento',
    },
    {
      id: 'debit_card',
      label: 'Cartão de Débito',
      description: 'Débito em conta',
    },
    {
      id: 'ticket',
      label: 'Boleto',
      description: 'Boleto bancário',
    },
    {
      id: 'account_money',
      label: 'Saldo MP',
      description: 'Saldo em conta do Mercado Pago',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seleção de Método */}
      <div>
        <p className="text-xs font-semibold text-pitch/60 uppercase tracking-wider mb-3">
          Escolha como pagar
        </p>
        <div className="space-y-2">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 border-2 px-4 py-3 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-brand bg-brand/5'
                  : 'border-gray-200 hover:border-brand/30'
              }`}
            >
              <input
                type="radio"
                name="mp-method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() =>
                  setSelectedMethod(
                    method.id as
                      | 'credit_card'
                      | 'debit_card'
                      | 'ticket'
                      | 'account_money'
                  )
                }
                className="accent-brand"
              />
              <div>
                <p className="font-semibold text-pitch">{method.label}</p>
                <p className="text-sm text-pitch/60">{method.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Info sobre Mercado Pago */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Você será redirecionado para o Mercado Pago para completar o pagamento de forma
          segura.
        </p>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-pitch/70">Valor a pagar:</p>
          <p className="font-bold text-lg text-brand">
            R$ {totalAmount.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full font-semibold py-3 transition-colors text-white flex items-center justify-center gap-2 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-brand hover:bg-brand-dark'
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Conectando ao Mercado Pago...
          </>
        ) : (
          'Pagar com Mercado Pago'
        )}
      </button>
    </form>
  );
}
