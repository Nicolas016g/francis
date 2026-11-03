import FeaturedProduct from './FeaturedProduct';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getProductCover } from '@/lib/product-images';

export default async function FeaturedProductsGrid() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'asc' },
    take: 4,
  });

  return (
    <section className="py-12 bg-brand">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Produtos em <span className="bg-gradient-to-r from-pitch via-pitch to-pitch/80 text-transparent bg-clip-text">Destaque</span>
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-md">
            Descubra nossos best-sellers e novidades com excelentes descontos
          </p>
        </div>

        {/* Grid de produtos - 2 colunas para imagens mais verticais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <FeaturedProduct
              key={product.id}
              id={product.slug}
              name={product.name}
              description={product.description}
              price={Number(product.price)}
              image={getProductCover(product.slug, product.imageUrl) ?? '/logo_principal.png'}
              badge={product.tag ?? undefined}
              rating={5}
              inStock={product.stockQuantity > 0}
            />
          ))}
        </div>

        {/* CTA ao final */}
        <div className="mt-12 text-center">
        <Link
            href="/molhos"
            className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 transition-colors"
          >
            Ver Todos os Produtos →
          </Link>
        </div>
      </div>
    </section>
  );
}
