'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Início', exact: true },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/produtos', label: 'Produtos e estoque' },
  { href: '/admin/estoque', label: 'Histórico de estoque' },
];

export default function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <header className="bg-pitch text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-lg">
          Painel <span className="text-brand">Franci&apos;s</span>
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-white/70 hover:text-white underline-offset-2 hover:underline">Ver o site</Link>
          <span className="hidden sm:inline text-white/50">Olá, {adminName.split(' ')[0]}</span>
          <button onClick={logout} className="border border-white/30 hover:bg-white/10 px-3 py-1.5 rounded">Sair</button>
        </div>
      </div>
      <nav aria-label="Menu do painel" className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-4 transition-colors ${
                active ? 'border-brand text-white' : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
