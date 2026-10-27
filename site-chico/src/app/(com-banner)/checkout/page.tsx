'use client';

import { ShieldCheck, Truck, CreditCard, LogIn, Loader2, Package } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import type { ShippingOption } from '@/app/api/shipping/calculate/route';

interface AddressForm {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const emptyAddress: AddressForm = {
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

export default function Checkout() {
  const { total: subtotal, items, clearCart } = useCart();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();

  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [fetchingCep, setFetchingCep] = useState(false);

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutKeyRef = useRef<string | null>(null);

  const total = subtotal + (selectedShipping?.price ?? 0);

  // ── Auto-preenche endereço via ViaCEP ─────────────────────────────────────
  const handleCepBlur = useCallback(async () => {
    const cep = address.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setFetchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json() as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) {
        toast('CEP não encontrado.', 'error');
        return;
      }
      setAddress((prev) => ({
        ...prev,
        rua: data.logradouro ?? prev.rua,
        bairro: data.bairro ?? prev.bairro,
        cidade: data.localidade ?? prev.cidade,
        estado: data.uf ?? prev.estado,
      }));
    } catch {
      toast('Erro ao buscar CEP.', 'error');
    } finally {
      setFetchingCep(false);
    }
  }, [address.cep, toast]);

  // ── Calcula frete via Melhor Envio ─────────────────────────────────────────
  const handleCalculateShipping = async () => {
    const cep = address.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      toast('Informe um CEP válido para calcular o frete.', 'error');
      return;
    }
    if (items.length === 0) {
      toast('Seu carrinho está vazio.', 'error');
      return;
    }

    setCalculatingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode: cep,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json() as { options?: ShippingOption[]; error?: string };
      if (!res.ok || data.error) {
        toast(data.error ?? 'Erro ao calcular frete.', 'error');
        return;
      }
      setShippingOptions(data.options ?? []);
    } catch {
      toast('Erro ao calcular frete. Tente novamente.', 'error');
    } finally {
      setCalculatingShipping(false);
    }
  };

  // ── Finaliza com Mercado Pago ──────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!address.cep || !address.rua || !address.numero) {
      toast('Preencha o endereço de entrega antes de continuar.', 'error');
      return;
    }
    if (!selectedShipping) {
      toast('Selecione uma opção de frete para continuar.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      checkoutKeyRef.current ??= crypto.randomUUID();
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutKey: checkoutKeyRef.current,
          items: items.map((i) => ({ slug: i.slug, quantity: i.qty })),
          shippingQuote: selectedShipping.quoteToken,
          paymentMethod: 'MERCADO_PAGO',
          address: {
            recipientName: user?.name ?? '',
            recipientPhone: '',
            postalCode: address.cep,
            street: address.rua,
            number: address.numero,
            complement: address.complemento,
            neighborhood: address.bairro,
            city: address.cidade,
            state: address.estado,
          },
        }),
      });
      const orderData = await orderResponse.json() as { order?: { id: string }; error?: string };
      if (!orderResponse.ok || !orderData.order) {
        toast(orderData.error ?? 'Erro ao criar pedido.', 'error');
        return;
      }

      const res = await fetch('/api/payment/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.order.id }),
      });

      const data = await res.json() as {
        initPoint?: string;
        sandboxInitPoint?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        toast(data.error ?? 'Erro ao iniciar pagamento.', 'error');
        return;
      }

      clearCart();
      const url = data.initPoint ?? data.sandboxInitPoint;
      if (url) window.location.href = url;
    } catch {
      toast('Erro ao processar pagamento. Tente novamente.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <LogIn className="w-12 h-12 text-brand mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-pitch mb-2">Login necessário</h2>
        <p className="text-pitch/60 mb-6">Faça login ou crie uma conta para finalizar seu pedido.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="border-2 border-brand text-brand hover:bg-brand hover:text-white font-semibold px-8 py-3 transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Package className="w-12 h-12 text-brand mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-pitch mb-2">Carrinho vazio</h2>
        <p className="text-pitch/60 mb-6">Adicione produtos antes de finalizar o pedido.</p>
        <Link href="/" className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 transition-colors">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-pitch mb-2">
        Finalizar <span className="text-brand">Pedido</span>
      </h1>
      <p className="text-pitch/60 mb-8 text-sm flex items-center gap-1">
        <ShieldCheck className="w-4 h-4 text-green-500" /> Ambiente seguro — pagamento via Mercado Pago
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ── Formulário ──────────────────────────────────────────────────── */}
        <div className="md:col-span-2 space-y-6">

          {/* Endereço */}
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand" /> Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">CEP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="00000-000"
                    maxLength={9}
                    value={address.cep}
                    onChange={(e) => setAddress((p) => ({ ...p, cep: e.target.value }))}
                    onBlur={handleCepBlur}
                    className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                  {fetchingCep && <Loader2 className="w-5 h-5 text-brand animate-spin self-center" />}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Rua</label>
                <input
                  type="text"
                  placeholder="Rua"
                  value={address.rua}
                  onChange={(e) => setAddress((p) => ({ ...p, rua: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Número</label>
                <input
                  type="text"
                  placeholder="Número"
                  value={address.numero}
                  onChange={(e) => setAddress((p) => ({ ...p, numero: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Complemento</label>
                <input
                  type="text"
                  placeholder="Apto, Bloco…"
                  value={address.complemento}
                  onChange={(e) => setAddress((p) => ({ ...p, complemento: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={address.bairro}
                  onChange={(e) => setAddress((p) => ({ ...p, bairro: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={address.cidade}
                  onChange={(e) => setAddress((p) => ({ ...p, cidade: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Estado</label>
                <input
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={address.estado}
                  onChange={(e) => setAddress((p) => ({ ...p, estado: e.target.value.toUpperCase() }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Frete */}
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand" /> Opções de Frete
            </h2>
            <button
              onClick={handleCalculateShipping}
              disabled={calculatingShipping}
              className="w-full bg-pitch hover:bg-pitch/90 text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {calculatingShipping ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Calculando…</>
              ) : (
                'Calcular Frete'
              )}
            </button>

            {shippingOptions.length > 0 && (
              <div className="mt-4 space-y-2">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      selectedShipping?.id === opt.id
                        ? 'border-brand bg-brand/5'
                        : 'border-gray-200 hover:border-brand/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        className="accent-brand"
                        checked={selectedShipping?.id === opt.id}
                        onChange={() => setSelectedShipping(opt)}
                      />
                      <div>
                        <p className="font-medium text-sm text-pitch">{opt.name}</p>
                        <p className="text-xs text-pitch/50">{opt.company} · {opt.deliveryRange}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${opt.price === 0 ? 'text-green-600' : 'text-pitch'}`}>
                      {opt.priceFormatted}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Pagamento via Mercado Pago */}
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand" /> Pagamento
            </h2>
            <p className="text-sm text-pitch/60 mb-4">
              Você será redirecionado para o Mercado Pago — aceita cartão de crédito, débito, PIX e boleto.
            </p>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || !selectedShipping}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Aguarde…</>
              ) : (
                'Ir para Pagamento'
              )}
            </button>
            {!selectedShipping && (
              <p className="text-xs text-center text-pitch/50 mt-2">
                Selecione um frete para habilitar o pagamento.
              </p>
            )}
          </div>
        </div>

        {/* ── Resumo ──────────────────────────────────────────────────────── */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-sm p-6 sticky top-20">
            <h2 className="font-bold text-pitch mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between text-pitch/70">
                  <span className="truncate pr-2">{item.name} × {item.qty}</span>
                  <span className="shrink-0">
                    R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-pitch/70 pt-2 border-t border-gray-100">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-pitch/70">
                <span>Frete</span>
                <span className={selectedShipping ? (selectedShipping.price === 0 ? 'text-green-600 font-medium' : '') : 'text-pitch/40'}>
                  {selectedShipping ? selectedShipping.priceFormatted : 'A calcular'}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-pitch">
              <span>Total</span>
              <span className="text-brand text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            {selectedShipping && (
              <p className="text-xs text-pitch/50 mt-3 text-center">
                {selectedShipping.name} · {selectedShipping.deliveryRange}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
