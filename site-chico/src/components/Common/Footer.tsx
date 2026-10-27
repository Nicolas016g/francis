import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-pitch text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Marca */}
        <div>
          <div className="relative h-12 w-48 mb-3">
            <Image
              src="/logo_rodape.png"
              alt="Franci's Creative Kitchen"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Pimentas artesanais, molhos autorais e kits especiais para quem ama sabor de verdade.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-brand mb-3 text-sm uppercase tracking-wider">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { href: '/pimentas', label: 'Pimentas' },
              { href: '/molhos', label: 'Molhos' },
              { href: '/sobre', label: 'Sobre' },
              { href: '/contato', label: 'Contato' },
              { href: '/minha-conta', label: 'Minha Conta' },
              { href: '/termos', label: 'Termos de Uso' },
              { href: '/privacidade', label: 'Política de Privacidade' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h3 className="font-semibold text-brand mb-3 text-sm uppercase tracking-wider">Contato</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand shrink-0" />
              <span>(16) 99636-9876</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand shrink-0" />
              <span>contato@chicomolhos.com.br</span>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-brand shrink-0" />
              <Link
                href="https://instagram.com/francis.molhos"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand"
              >
                @francis.molhos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 px-4 text-center text-sm text-white/60">
        <p>
          &copy; {new Date().getFullYear()} Franci&apos;s Creative Kitchen. Todos os direitos reservados.{' '}
          <Link href="/termos" className="hover:text-brand transition-colors">Termos</Link>
          {' · '}
          <Link href="/privacidade" className="hover:text-brand transition-colors">Privacidade</Link>
        </p>
      </div>
    </footer>
  );
}
