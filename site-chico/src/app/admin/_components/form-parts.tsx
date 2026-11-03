'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionState } from '../actions';

export const inputClass =
  'w-full border border-gray-300 rounded px-3 py-2.5 text-base bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-pitch mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-pitch/60 mt-1">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children, pendingText = 'Salvando…' }: { children: ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-bold px-6 py-3 rounded text-base transition-colors"
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={`px-4 py-3 rounded text-sm font-medium ${state.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
    >
      {state.message}
    </p>
  );
}
