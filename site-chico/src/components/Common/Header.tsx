'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { href: '/pimentas', label: 'PIMENTAS' },
  { href: '/molhos', label: 'MOLHOS' },
  { href: '/kits', label: 'KITS' },
  { href: '/sobre', label: 'SOBRE' },
  { href: '/contato', label: 'CONTATO' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-pitch text-white z-50 w-full">
      {/* Header fixo com navegação completa */}
      <div className="bg-pitch border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Barra de pesquisa - esquerda */}
          <div className="flex items-center bg-white w-full max-w-xs">
            <input
              type="text"
              placeholder="Buscar..."
              className="flex-1 px-4 py-2 text-pitch placeholder-gray-400 focus:outline-none bg-white text-sm font-medium"
            />
            <button className="px-4 py-2 text-pitch hover:bg-gray-100 transition">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Menu de navegação - centro desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold flex-1 justify-center">
            <Link
              href="/"
              className="hover:text-brand transition-colors duration-200 text-brand border border-brand/40 px-3 py-1 text-xs"
            >
              INÍCIO
            </Link>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-brand transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Carrinho + usuário + login - direita */}
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/carrinho" className="relative hover:text-brand transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand text-white text-xs w-4 h-4 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/login" className="hover:text-brand transition-colors">
              <User className="w-6 h-6" />
            </Link>
            <span className="hidden md:inline text-white/40">|</span>
            {isLoggedIn ? (
              <>
                <span className="hidden md:inline text-xs font-medium text-brand">{user?.name}</span>
                <button onClick={logout} className="text-xs font-medium hover:text-brand transition hidden md:inline flex items-center gap-1" aria-label="Sair">
                  <LogOut className="w-4 h-4 inline" /> SAIR
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs font-medium hover:text-brand transition hidden md:inline">LOGIN</Link>
                <Link href="/cadastro" className="text-xs font-medium hover:text-brand transition hidden md:inline">CADASTRO</Link>
              </>
            )}

            {/* Menu button mobile */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-brand ml-2"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className="absolute top-full left-0 right-0 md:hidden bg-pitch/95 border-t border-white/10 px-4 py-4">
              <nav className="space-y-3 text-sm font-medium">
                <Link
                  href="/"
                  className="block text-brand hover:text-brand/80 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  INÍCIO
                </Link>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block hover:text-brand transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
