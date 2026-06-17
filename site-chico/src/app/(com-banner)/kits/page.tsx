import type { Metadata } from 'next';
import Link from "next/link";
import { Gift, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: 'Kits & Combos',
  description: 'Kits presenteáveis com pimentas artesanais e molhos autorais. Kit Pimentas, Kit Hamburgada e Kit Misto.',
};

const kits = [
  {
    slug: "kit-pimentas",
    name: "Kit Pimentas",
    desc: "4 pimentas artesanais selecionadas em embalagem presenteável. A coleção perfeita para amantes de ardência.",
    price: "R$ 99,90",
    rating: 5,
    tag: "Mais Vendido",
    itens: ["Pimenta Caseira", "Pimenta Dedo de Moça", "Pimenta Jalapeño", "Pequimenta"],
    fotos: 9,
  },
  {
    slug: "kit-hamburgada",
    name: "Kit Hamburgada",
    desc: "Os 4 molhos essenciais para montar o hambúrguer artesanal perfeito.",
    price: "R$ 99,90",
    rating: 5,
    tag: "Destaque",
    itens: ["Ketchup Artesanal", "Mostarda Artesanal", "Barbecue Artesanal", "Relish de Pepino"],
    fotos: 5,
  },
  {
    slug: "kit-misto",
    name: "Kit Misto",
    desc: "O melhor dos dois mundos: 2 molhos clássicos e 2 pimentas para quem gosta de variedade.",
    price: "R$ 99,90",
    rating: 5,
    tag: "Equilíbrio",
    itens: ["Ketchup Artesanal", "Mostarda Artesanal", "Pimenta Caseira", "Pimenta Dedo de Moça"],
    fotos: 5,
  },
];

export default function Kits() {
  return (
    <>
      {/* Header branco */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Gift className="w-10 h-10 text-brand mx-auto mb-3" />
          <h1 className="text-4xl font-bold text-pitch mb-2">
            Kits & <span className="text-brand">Combos</span>
          </h1>
          <p className="text-pitch/80 text-lg max-w-md mx-auto">
            Combinações pensadas para presentear ou para montar sua coleção pessoal com estilo.
          </p>
        </div>
      </div>

      {/* Grid laranja */}
      <div className="bg-brand min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kits.map((k) => (
            <div key={k.slug} className="bg-white border border-gray-100 shadow hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">
              {/* Imagem placeholder */}
              <div className="bg-off-white h-52 flex items-center justify-center relative flex-shrink-0">
                {k.tag && (
                  <span className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2 py-1">
                    {k.tag}
                  </span>
                )}
                <div className="text-6xl">🎁</div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-bold text-pitch text-lg mb-2 group-hover:text-brand transition-colors">{k.name}</h2>
                <p className="text-pitch/60 text-sm mb-4">{k.desc}</p>

                {/* Itens */}
                <ul className="text-xs text-pitch/50 mb-4 space-y-1 flex-1">
                  {k.itens.map((item) => (
                    <li key={item} className="flex items-center gap-1">
                      <span className="text-brand">•</span> {item}
                    </li>
                  ))}
                </ul>

                {/* Rating */}
                <div className="flex mb-4">
                  {Array.from({ length: k.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-brand text-brand" />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-pitch font-bold text-xl">{k.price}</span>
                  <Link
                    href={`/produto/${k.slug}`}
                    className="bg-brand hover:bg-brand-dark text-white px-4 py-2 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    Ver Kit <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </>
  );
}

