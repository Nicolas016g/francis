import Link from "next/link";
import { Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/Product/ProductGallery";
import AddToCartSection from "./AddToCartSection";
import ReviewForm from "./ReviewForm";
import { prisma } from '@/lib/prisma';
import { getProductImages } from '@/lib/product-images';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: { reviews: { orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produto não encontrado' };
  return {
    title: product.name,
    description: `Compre ${product.name} — produto artesanal da Franci's Creative Kitchen. ${product.description}`,
  };
}

export default async function Produto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const rating = product.reviews.length ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length : 0;
  const categoryLabel =
    product.category === 'PIMENTA' ? 'Pimentas' : product.category === 'KIT' ? 'Kits' : 'Molhos';
  const categoryPath =
    product.category === 'PIMENTA' ? 'pimentas' : product.category === 'KIT' ? 'kits' : 'molhos';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-pitch/50 mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${categoryPath}`} className="hover:text-brand transition-colors">{categoryLabel}</Link>
        <span>/</span>
        <span className="text-pitch">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Galeria de Imagens */}
        <div>
          <ProductGallery productName={product.name} imageUrl={product.imageUrl} images={getProductImages(product.slug, product.imageUrl)} />
        </div>

        {/* Info */}
        <div>
          <span className="text-brand text-xs font-semibold uppercase tracking-widest mb-2 block">
            {categoryLabel}
          </span>
          <h1 className="text-3xl font-bold text-pitch mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-brand text-brand' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-pitch/60">({product.reviews.length} avaliações)</span>
          </div>

          <div className="text-3xl font-bold text-pitch mb-6">
            R$ {product.price.toString().replace('.', ',')}
          </div>

          <p className="text-pitch/70 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantidade + Botão — Client Component */}
          <AddToCartSection slug={product.slug} name={product.name} price={Number(product.price)} inStock={product.stockQuantity > 0} />
        </div>
      </div>

      {/* Avaliações */}
      <div>
        <h2 className="text-2xl font-bold text-pitch mb-6">Avaliações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {product.reviews.map((r) => (
            <div key={r.id} className="bg-white border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-pitch">{r.user.name}</span>
                <span className="text-xs text-pitch/40">{r.createdAt.toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-brand text-brand" />
                ))}
              </div>
              <p className="text-sm text-pitch/70">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Formulário de avaliação — Client Component */}
        <ReviewForm productSlug={product.slug} />
      </div>
    </div>
  );
}
