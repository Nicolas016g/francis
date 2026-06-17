'use client';

import { CreditCard, QrCode, DollarSign } from 'lucide-react';
import { useState } from 'react';

type PaymentMethod = 'card' | 'pix' | 'mercadopago';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'card',
      label: 'Cartão de Crédito/Débito',
      icon: CreditCard,
      description: 'Parcelado em até 12x',
    },
    {
      id: 'pix',
      label: 'PIX',
      icon: QrCode,
      description: 'Transferência instantânea',
    },
    {
      id: 'mercadopago',
      label: 'Mercado Pago',
      icon: DollarSign,
      description: 'Múltiplas opções de pagamento',
    },
  ];

  return (
    <div className="space-y-3">
      {methods.map(({ id, label, icon: Icon, description }) => (
        <button
          key={id}
          onClick={() => onSelect(id as PaymentMethod)}
          className={`w-full flex items-center gap-4 border-2 px-4 py-4 transition-all text-left ${
            selectedMethod === id
              ? 'border-brand bg-brand/5'
              : 'border-gray-200 bg-white hover:border-brand/30'
          }`}
        >
          <Icon
            className={`w-6 h-6 flex-shrink-0 ${
              selectedMethod === id ? 'text-brand' : 'text-gray-400'
            }`}
          />
          <div className="flex-1">
            <p className="font-semibold text-pitch">{label}</p>
            <p className="text-sm text-pitch/60">{description}</p>
          </div>
          <div
            className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
              selectedMethod === id
                ? 'border-brand bg-brand'
                : 'border-gray-300'
            }`}
          >
            {selectedMethod === id && (
              <div className="w-2 h-2 bg-white" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
