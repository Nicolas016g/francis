'use client';

import FeaturedProduct from './FeaturedProduct';

interface FeaturedProductsGridProps {
  onAddToCart?: (productId: string) => void;
}

// Mock de dados - substitua pelos dados reais do seu banco
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Molho Habanero Artesanal',
    description: 'Molho super picante com frutas tropicais',
    price: 34.90,
    originalPrice: 49.90,
    image: '/products/habanero.jpg',
    badge: 'BESTSELLER',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Pimenta Biquinho Fresca',
    description: 'Pimenta suave, perfeita para iniciantes',
    price: 28.90,
    originalPrice: 38.90,
    image: '/products/biquinho.jpg',
    badge: 'NOVO',
    rating: 5,
  },
  {
    id: '3',
    name: 'Kit Pimentas Premium',
    description: '3 variedades selecionadas para experiência completa',
    price: 89.90,
    originalPrice: 134.90,
    image: '/products/kit-premium.jpg',
    badge: 'TAXA REDUZIDA',
    rating: 4.9,
  },
];

export default function FeaturedProductsGrid({
  onAddToCart,
}: FeaturedProductsGridProps) {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pitch mb-2">
            Produtos em <span className="text-brand">Destaque</span>
          </h2>
          <p className="text-pitch/60 text-lg max-w-2xl mx-auto">
            Descubra nossos best-sellers e novidades com excelentes descontos
          </p>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <FeaturedProduct
              key={product.id}
              {...product}
              onAddToCart={() => onAddToCart?.(product.id)}
            />
          ))}
        </div>

        {/* CTA ao final */}
        <div className="mt-12 text-center">
          <a
            href="/molhos"
            className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Ver Todos os Produtos →
          </a>
        </div>
      </div>
    </section>
  );
}
