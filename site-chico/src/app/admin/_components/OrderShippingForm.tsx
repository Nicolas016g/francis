'use client';

import { useActionState } from 'react';
import { updateOrderShipping } from '../actions';
import { Field, FormMessage, SubmitButton, inputClass } from './form-parts';

export default function OrderShippingForm({
  orderId,
  step,
}: {
  orderId: string;
  step: 'ship' | 'deliver';
}) {
  const [state, action] = useActionState(updateOrderShipping, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="step" value={step} />
      {step === 'ship' ? (
        <>
          <p className="text-sm text-pitch/70">Depois de postar o pacote, marque como enviado. O cliente verá o novo status na conta dele.</p>
          <Field label="Código de rastreio (opcional)">
            <input name="trackingCode" maxLength={100} className={inputClass} placeholder="Ex.: AB123456789BR" />
          </Field>
        </>
      ) : (
        <p className="text-sm text-pitch/70">Quando o cliente confirmar que recebeu, finalize o pedido.</p>
      )}
      <FormMessage state={state} />
      <SubmitButton pendingText="Atualizando…">{step === 'ship' ? 'Marcar como enviado' : 'Marcar como entregue'}</SubmitButton>
    </form>
  );
}
