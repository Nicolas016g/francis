import type { Metadata } from 'next';
import { ProductCard } from '@/components/Product';
import { prisma } from '@/lib/prisma';
import { getProductCover } from '@/lib/product-images';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kits Especiais',
  description: 'Kits especiais de pimentas e molhos artesanais da Franci\'s Creative Kitchen.',
};

export default async function Kits() {
  const products = await prisma.product.findMany({
    where: { category: 'KIT', active: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <>
      <div className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-pitch mb-2">
            <span className="text-brand">Kits</span> Especiais
          </h1>
          <p className="text-pitch/80 text-lg">
            Seleções especiais para presentear ou experimentar diferentes sabores.
          </p>
        </div>
      </div>
      <div className="bg-brand min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <p className="text-white/70 text-center py-20">Nenhum kit encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  name={product.name}
                  price={`R$ ${product.price.toString().replace('.', ',')}`}
                  rating={5}
                  slug={product.slug}
                  tag={product.tag ?? undefined}
                  imageUrl={getProductCover(product.slug, product.imageUrl)}
                  inStock={product.stockQuantity > 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
