'use client';

import { useActionState, useRef } from 'react';
import { adjustStock, type ActionState } from '../actions';
import { Field, FormMessage, SubmitButton, inputClass } from './form-parts';

const options = [
  { value: 'ENTRY', label: 'Chegaram produtos (entrada)' },
  { value: 'OUTPUT', label: 'Saiu produto (venda fora do site, brinde...)' },
  { value: 'LOSS', label: 'Perda ou avaria (quebrou, venceu...)' },
  { value: 'COUNT', label: 'Contei e o número certo é... (correção)' },
];

export default function StockForm({ productId, current }: { productId: string; current: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(async (previous: ActionState, formData: FormData) => {
    const result = await adjustStock(previous, formData);
    if (result?.ok) formRef.current?.reset();
    return result;
  }, null);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <p className="text-sm text-pitch/70">
        Hoje há <strong className="text-pitch text-base">{current}</strong> unidades. Escolha o que aconteceu e informe a quantidade.
      </p>
      <Field label="O que aconteceu?">
        <select name="type" defaultValue="ENTRY" className={inputClass}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </Field>
      <Field label="Quantidade" hint='Na opção "Contei e o número certo é", informe o total que existe agora.'>
        <input name="quantity" required inputMode="numeric" className={inputClass} placeholder="Ex.: 12" />
      </Field>
      <Field label="Observação (opcional)">
        <input name="note" maxLength={190} className={inputClass} placeholder="Ex.: Fornada de sexta" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingText="Registrando…">Registrar no estoque</SubmitButton>
    </form>
  );
}
