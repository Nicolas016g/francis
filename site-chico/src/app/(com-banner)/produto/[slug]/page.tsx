import Link from "next/link";
import { Star } from "lucide-react";
import type { Metadata } from "next";
import ProductGallery from "@/components/Product/ProductGallery";
import AddToCartSection from "./AddToCartSection";
import ReviewForm from "./ReviewForm";

// Mock — substituir por consulta ao banco de dados
const getProduct = (slug: string) => ({
  slug,
  name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  price: 28.90,
  category: 'Pimentas',
  reviews: [
    { name: 'Carlos A.', rating: 5, text: 'Produto excelente, chegou rápido e bem embalado. Recomendo!', date: 'Mar 2026' },
    { name: 'Mariana L.', rating: 5, text: 'Qualidade incrível, sabor autêntico. Já fiz meu segundo pedido.', date: 'Mar 2026' },
  ],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product.name,
    description: `Compre ${product.name} — produto artesanal da Franci's Creative Kitchen. Qualidade e sabor garantidos.`,
  };
}

export default async function Produto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-pitch/50 mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/pimentas" className="hover:text-brand transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-pitch">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Galeria de Imagens */}
        <div>
          <ProductGallery productName={product.name} />
        </div>

        {/* Info */}
        <div>
          <span className="text-brand text-xs font-semibold uppercase tracking-widest mb-2 block">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-pitch mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand text-brand" />
              ))}
            </div>
            <span className="text-sm text-pitch/60">({product.reviews.length} avaliações)</span>
          </div>

          <div className="text-3xl font-bold text-pitch mb-6">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>

          <p className="text-pitch/70 leading-relaxed mb-6">
            Descrição do produto a ser fornecida. Ingredientes, modo de preparo, nível de ardência, peso líquido, etc.
          </p>

          {/* Quantidade + Botão — Client Component */}
          <AddToCartSection slug={product.slug} name={product.name} price={product.price} />
        </div>
      </div>

      {/* Avaliações */}
      <div>
        <h2 className="text-2xl font-bold text-pitch mb-6">Avaliações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {product.reviews.map((r) => (
            <div key={r.name} className="bg-white border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-pitch">{r.name}</span>
                <span className="text-xs text-pitch/40">{r.date}</span>
              </div>
              <div className="flex mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-brand text-brand" />
                ))}
              </div>
              <p className="text-sm text-pitch/70">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Formulário de avaliação — Client Component */}
        <ReviewForm productSlug={product.slug} />
      </div>
    </div>
  );
}
