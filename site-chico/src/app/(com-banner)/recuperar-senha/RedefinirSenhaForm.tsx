'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RedefinirSenhaForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível redefinir a senha.');
      setMessage(data.message ?? 'Senha redefinida com sucesso.');
      setPassword('');
      setConfirm('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível redefinir a senha.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 space-y-5">
      <div>
        <label htmlFor="new-password" className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">Nova senha</label>
        <input id="new-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand" />
      </div>
      <div>
        <label htmlFor="confirm-password" className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-2">Confirme a nova senha</label>
        <input id="confirm-password" type="password" minLength={8} value={confirm} onChange={(event) => setConfirm(event.target.value)} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand" />
      </div>
      {error && <p role="alert" className="bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</p>}
      {message && <p role="status" className="bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</p>}
      <button type="submit" disabled={saving} className="w-full bg-brand hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 transition-colors">
        {saving ? 'Salvando...' : 'Redefinir senha'}
      </button>
      {message && <Link href="/login" className="block text-center text-sm text-brand hover:underline">Ir para o login</Link>}
    </form>
  );
}
