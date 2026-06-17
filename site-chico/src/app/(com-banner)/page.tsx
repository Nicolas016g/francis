import Link from "next/link";
import { ProductCard, FeaturedProductsGrid } from "@/components/Product";
import { ArrowRight, Flame, Star, Truck } from "lucide-react";
import HomeReviewSection from "@/components/HomeReviewSection";

const featured = [
  { name: "Pimenta Caseira", price: "R$ 28,90", rating: 5, slug: "pimenta-caseira", tag: "Suave" },
  { name: "Molho Ketchup Artesanal", price: "R$ 28,90", rating: 5, slug: "molho-ketchup" },
  { name: "Pimenta Dedo de Moça", price: "R$ 28,90", rating: 5, slug: "pimenta-dedo-de-moca", tag: "Mais Vendida" },
  { name: "Kit Hamburgada", price: "R$ 99,90", rating: 5, slug: "kit-hamburgada", tag: "Kit" },
];

export default function Home() {
  return (
    <>
      {/* Hero — fundo com foto: 1440 × 600 px recomendado (proporção ~2.4:1) */}
      <section
        className="relative bg-brand py-0"
        style={{ minHeight: '600px' }}
      >
        {/* Foto de fundo: coloque em /public/hero-bg.jpg (1440×600 px) */}
        {/* <Image src="/hero-bg.jpg" alt="" fill className="object-cover" priority /> */}
        {/* Overlay escuro para legibilidade */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4" style={{ minHeight: '600px' }}>
          <span className="text-white/70 text-sm font-semibold uppercase tracking-[0.3em] mb-4 block">
            Artesanal & Autoral
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
            Pimentas que<br />
            <span className="text-brand">incendeiam</span> o paladar
          </h1>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-pitch py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: <Flame className="w-6 h-6 text-brand mx-auto mb-2" />, title: "100% Artesanal", desc: "Produção própria com ingredientes selecionados" },
            { icon: <Truck className="w-6 h-6 text-brand mx-auto mb-2" />, title: "Entrega para todo Brasil", desc: "Embalagem segura e envio rápido" },
            { icon: <Star className="w-6 h-6 text-brand mx-auto mb-2" />, title: "Qualidade Garantida", desc: "Mais de 500 clientes satisfeitos" },
          ].map((b) => (
            <div key={b.title} className="bg-black/30 p-6 border border-white/10">
              {b.icon}
              <h3 className="font-semibold text-white mb-1">{b.title}</h3>
              <p className="text-sm text-white/60">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos em Destaque */}
      <FeaturedProductsGrid />

      {/* Mais Vendidos */}
      <section className="py-16 px-4 bg-brand">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-pitch drop-shadow-lg">Mais Vendidos</h2>
            <Link href="/pimentas" className="text-pitch font-medium hover:text-white transition-colors flex items-center gap-1 bg-pitch/10 px-4 py-2 border border-pitch/20">
              Ver tudo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 px-4 bg-off-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-pitch mb-2 text-center">O que nossos <span className="text-brand">clientes dizem</span></h2>
          <p className="text-pitch/60 text-center mb-8">Mais de 500 clientes satisfeitos com nossos produtos</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ana Paula", text: "O kit hamburgada é incrível! Uso em tudo. Entrega rápida e embalagem perfeita.", rating: 5 },
              { name: "Ricardo M.", text: "Comprei o kit de pimentas de presente para meu pai e ele amou. Qualidade artesanal de verdade.", rating: 5 },
              { name: "Fernanda T.", text: "A pimenta caseira é viciante. Já é minha terceira compra!", rating: 5 },
            ].map((d) => (
              <div key={d.name} className="bg-white p-6 border border-brand/10">
                <div className="flex mb-3">
                  {Array.from({ length: d.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand text-brand" />
                  ))}
                </div>
                <p className="text-pitch/80 text-sm mb-4 italic">"{d.text}"</p>
                <span className="text-sm font-semibold text-pitch">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deixe sua opinião */}
      <HomeReviewSection />

    </>
  );
}

