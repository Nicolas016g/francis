import type { Metadata } from 'next';
import { ProductCard } from '@/components/Product';
import { findActiveProducts } from '@/lib/products';
import { getProductCover } from '@/lib/product-images';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buscar produtos',
  description: 'Encontre pimentas, molhos e kits artesanais da Franci\'s Creative Kitchen.',
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function Busca({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] ?? '' : params.q ?? '';
  const query = rawQuery.trim();
  const queryIsTooLong = query.length > 100;
  const products = query && !queryIsTooLong
    ? await findActiveProducts({ search: query })
    : [];

  return (
    <>
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-pitch mb-3">
            Buscar <span className="text-brand">produtos</span>
          </h1>
          <form action="/busca" method="GET" role="search" className="flex max-w-xl">
            <label htmlFor="search-query" className="sr-only">Buscar produtos</label>
            <input
              id="search-query"
              name="q"
              type="search"
              defaultValue={query}
              maxLength={100}
              placeholder="Nome ou descrição do produto"
              className="min-w-0 flex-1 border border-gray-300 px-4 py-3 text-pitch focus:outline-none focus:border-brand"
            />
            <button type="submit" className="bg-brand px-5 py-3 font-semibold text-white hover:bg-orange-600">
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="bg-brand min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {!query ? (
            <p className="text-white/80 text-center py-12">Digite um termo para buscar produtos.</p>
          ) : queryIsTooLong ? (
            <p role="alert" className="text-white text-center py-12">
              A busca deve ter no máximo 100 caracteres.
            </p>
          ) : products.length === 0 ? (
            <p className="text-white/80 text-center py-12">
              Nenhum produto encontrado para &quot;{query}&quot;.
            </p>
          ) : (
            <>
              <p className="text-white/80 mb-6">
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'} para &quot;{query}&quot;.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    name={product.name}
                    price={`R$ ${product.price.toString().replace('.', ',')}`}
                    rating={0}
                    slug={product.slug}
                    tag={product.tag ?? undefined}
                    imageUrl={getProductCover(product.slug, product.imageUrl)}
                    inStock={product.stockQuantity > 0}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
