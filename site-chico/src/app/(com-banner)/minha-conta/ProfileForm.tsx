'use client';

import { useState } from 'react';

interface ProfileFormProps {
  user: { name: string; email: string; phone: string | null };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await response.json() as { user?: typeof user; error?: string };
      if (!response.ok || !data.user) throw new Error(data.error ?? 'Não foi possível salvar seus dados.');
      setName(data.user.name);
      setEmail(data.user.email);
      setPhone(data.user.phone ?? '');
      setMessage('Dados salvos com sucesso.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível salvar seus dados.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="profile-name" className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Nome completo</label>
        <input id="profile-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand" />
      </div>
      <div>
        <label htmlFor="profile-email" className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">E-mail</label>
        <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand" />
      </div>
      <div>
        <label htmlFor="profile-phone" className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Telefone / WhatsApp</label>
        <input id="profile-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(XX) XXXXX-XXXX" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand" />
      </div>
      {error && <p role="alert" className="bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</p>}
      {message && <p role="status" className="bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</p>}
      <button type="submit" disabled={saving} className="bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold px-6 py-3 transition-colors">
        {saving ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  );
}
