import Link from "next/link";
import { Flame, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-pitch text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Marca */}
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <Flame className="text-brand w-6 h-6" />
            <span>
              <span className="text-brand">Chico</span>
              <span>Pimenta</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Pimentas artesanais, molhos autorais e kits especiais para quem ama sabor de verdade.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-brand mb-3 text-sm uppercase tracking-wider">Navegação</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { href: "/pimentas", label: "Pimentas" },
              { href: "/molhos", label: "Molhos" },
              { href: "/kits", label: "Kits" },
              { href: "/sobre", label: "Sobre" },
              { href: "/contato", label: "Contato" },
              { href: "/minha-conta", label: "Minha Conta" },
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
              <span>(XX) XXXXX-XXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand shrink-0" />
              <span>contato@chicopimenta.com.br</span>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-brand shrink-0" />
              <a href="#" className="hover:text-brand transition-colors">@chicopimenta</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs text-white/40 py-4 px-4">
        © {new Date().getFullYear()} ChicoPimenta. Todos os direitos reservados.
      </div>
    </footer>
  );
}
