import type { Metadata } from 'next';
import Link from "next/link";
import { User, ShoppingBag, MapPin, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: 'Minha Conta',
  description: 'Gerencie seus dados, pedidos e endereços.',
};

export default function MinhaConta() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-pitch mb-8">
        Minha <span className="text-brand">Conta</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <nav className="bg-white shadow-sm overflow-hidden">
            {[
              { icon: <User className="w-4 h-4" />, label: "Dados Pessoais", active: true },
              { icon: <ShoppingBag className="w-4 h-4" />, label: "Meus Pedidos", active: false },
              { icon: <MapPin className="w-4 h-4" />, label: "Endereços", active: false },
              { icon: <Lock className="w-4 h-4" />, label: "Segurança", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b last:border-0 border-gray-50 ${
                  item.active ? "text-brand bg-orange-50" : "text-pitch/70 hover:text-brand hover:bg-orange-50"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <div className="md:col-span-3">
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-6">Dados Pessoais</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Sobrenome</label>
                  <input
                    type="text"
                    placeholder="Seu sobrenome"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-pitch/60 uppercase tracking-wider block mb-1">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand"
                />
              </div>
              <button className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 transition-colors">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
