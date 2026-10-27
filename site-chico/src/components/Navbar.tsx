"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, Menu, X, Flame } from "lucide-react";

const links = [
  { href: "/pimentas", label: "Pimentas" },
  { href: "/molhos", label: "Molhos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-pitch text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Flame className="text-brand w-7 h-7" />
          <span>
            <span className="text-brand">Chico</span>
            <span className="text-white">Pimenta</span>
          </span>
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
            <span className="absolute -top-2 -right-2 bg-brand text-white text-xs w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
          <Link href="/login" className="hidden md:block hover:text-brand transition-colors">
            <User className="w-6 h-6" />
          </Link>

          {/* Botão mobile menu */}
          <button
            className="md:hidden hover:text-brand transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden bg-pitch border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-brand transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="hover:text-brand transition-colors" onClick={() => setOpen(false)}>
            Minha Conta
          </Link>
        </nav>
      )}
    </header>
  );
}
