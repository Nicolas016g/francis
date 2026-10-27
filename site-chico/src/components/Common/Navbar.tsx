'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const links = [
  { href: '/pimentas', label: 'Pimentas' },
  { href: '/molhos', label: 'Molhos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="bg-pitch text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="relative h-10 w-32">
            <Image src="/logo_principal.png" alt="Franci's Creative Kitchen" fill className="object-contain" />
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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

        {/* Ações */}
        <div className="flex items-center gap-4">
          <Link href="/carrinho" className="relative hover:text-brand transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link href="/login" className="hover:text-brand transition-colors">
            <User className="w-6 h-6" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden hover:text-brand transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-pitch/95 border-t border-white/10 px-4 py-4">
          <nav className="space-y-3 text-sm font-medium">
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
    </header>
  );
}
