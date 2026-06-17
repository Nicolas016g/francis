'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface PIXPaymentFormProps {
  totalAmount: number;
  onSubmit: (pixKey: string) => void;
  isLoading?: boolean;
}

export default function PIXPaymentForm({
  totalAmount,
  onSubmit,
  isLoading = false,
}: PIXPaymentFormProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aqui você chamará a API para gerar o QR Code PIX
    const generatePixQrCode = async () => {
      try {
        const response = await fetch('/api/payment/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
        });

        if (response.ok) {
          const data = await response.json();
          setQrCode(data.qrCode);
          setPixKey(data.pixKey);
        }
      } catch (error) {
        console.error('Erro ao gerar QR Code PIX:', error);
      } finally {
        setLoading(false);
      }
    };

    generatePixQrCode();
  }, [totalAmount]);

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    onSubmit(pixKey);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        <p className="text-sm text-pitch/60 mt-4">Gerando QR Code PIX...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="bg-gray-50 p-6 flex flex-col items-center">
        {qrCode ? (
          <>
            <img
              src={`data:image/jpeg;base64,${qrCode}`}
              alt="QR Code PIX"
              className="w-48 h-48 border-4 border-white shadow-md"
            />
            <p className="text-sm text-pitch/60 mt-4">
              Aponte seu smartphone para o QR Code
            </p>
          </>
        ) : (
          <p className="text-pitch/60">Erro ao gerar QR Code</p>
        )}
      </div>

      {/* Chave PIX */}
      <div>
        <p className="text-xs font-semibold text-pitch/60 uppercase tracking-wider mb-2">
          Ou copie a chave PIX
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={pixKey}
            className="flex-1 border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-pitch"
          />
          <button
            type="button"
            onClick={handleCopyPixKey}
            className={`px-4 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-brand text-white hover:bg-brand-dark'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>📱 Como pagar:</strong> Escaneie o QR Code com seu banco ou copie e cole a chave PIX no seu aplicativo bancário.
        </p>
      </div>

      {/* Confirmação */}
      <div className="space-y-3">
        <p className="text-sm text-pitch/70">
          Após efetuar o PIX, clique em "Confirmei o PIX" para finalizar o pedido:
        </p>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !qrCode}
          className={`w-full font-semibold py-3 transition-colors text-white ${
            isLoading || !qrCode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-brand hover:bg-brand-dark'
          }`}
        >
          {isLoading ? 'Processando...' : 'Confirmei o PIX'}
        </button>
      </div>
    </div>
  );
}
