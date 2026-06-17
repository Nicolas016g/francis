'use client';

import { useState } from 'react';

interface CardPaymentFormProps {
  onSubmit: (data: CardPaymentData) => void;
  isLoading?: boolean;
}

export interface CardPaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  installments: number;
}

export default function CardPaymentForm({
  onSubmit,
  isLoading = false,
}: CardPaymentFormProps) {
  const [formData, setFormData] = useState<CardPaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    installments: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Número do cartão é obrigatório';
    }
    if (!formData.cardHolder) {
      newErrors.cardHolder = 'Nome do titular é obrigatório';
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = 'Validade é obrigatória';
    }
    if (formData.cvv.length !== 3 && formData.cvv.length !== 4) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData({ ...formData, cardNumber: formatted });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Número do Cartão */}
      <div>
        <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
          Número do Cartão
        </label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
            errors.cardNumber ? 'border-red-500' : 'border-gray-200 focus:border-brand'
          }`}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Nome do Titular */}
      <div>
        <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
          Nome do Titular
        </label>
        <input
          type="text"
          placeholder="JOÃO DA SILVA"
          value={formData.cardHolder}
          onChange={(e) =>
            setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })
          }
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
            errors.cardHolder ? 'border-red-500' : 'border-gray-200 focus:border-brand'
          }`}
        />
        {errors.cardHolder && (
          <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
        )}
      </div>

      {/* Validade e CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
            Validade (MM/AA)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="MM"
              min="1"
              max="12"
              maxLength={2}
              value={formData.expiryMonth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expiryMonth: e.target.value.slice(0, 2),
                })
              }
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                errors.expiry ? 'border-red-500' : 'border-gray-200 focus:border-brand'
              }`}
            />
            <input
              type="number"
              placeholder="AA"
              maxLength={2}
              value={formData.expiryYear}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expiryYear: e.target.value.slice(0, 2),
                })
              }
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                errors.expiry ? 'border-red-500' : 'border-gray-200 focus:border-brand'
              }`}
            />
          </div>
          {errors.expiry && (
            <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
            CVV
          </label>
          <input
            type="password"
            placeholder="000"
            maxLength={4}
            value={formData.cvv}
            onChange={(e) =>
              setFormData({
                ...formData,
                cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
              })
            }
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
              errors.cvv ? 'border-red-500' : 'border-gray-200 focus:border-brand'
            }`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Parcelamento */}
      <div>
        <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">
          Parcelamento
        </label>
        <select
          value={formData.installments}
          onChange={(e) =>
            setFormData({ ...formData, installments: parseInt(e.target.value) })
          }
          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
        >
          {[1, 2, 3, 4, 6, 8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {n}x sem juros
            </option>
          ))}
        </select>
      </div>

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full font-semibold py-3 transition-colors text-white ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-brand hover:bg-brand-dark'
        }`}
      >
        {isLoading ? 'Processando...' : 'Pagar com Cartão'}
      </button>
    </form>
  );
}
