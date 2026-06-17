'use client';

import FeaturedProduct from './FeaturedProduct';
import Link from 'next/link';

export default function FeaturedProductsGrid() {
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
          {FEATURED_PRODUCTS.map((product) => (
            <FeaturedProduct key={product.id} {...product} />
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

// Produtos em destaque — atualize com seus dados reais
const FEATURED_PRODUCTS = [
  {
    id: 'pimenta-dedo-de-moca',
    name: 'Pimenta Dedo de Moça',
    description: 'Ardência média, sabor frutado e marcante. Perfeita para conservas e molhos.',
    price: 28.9,
    image: '/products/dedo-de-moca.jpg',
    badge: 'MAIS VENDIDA',
    rating: 5,
  },
  {
    id: 'molho-ketchup',
    name: 'Ketchup Artesanal',
    description: 'Ketchup caseiro com tomates selecionados, sabor equilibrado e textura cremosa.',
    price: 28.9,
    image: '/products/ketchup.jpg',
    badge: 'DESTAQUE',
    rating: 5,
  },
  {
    id: 'kit-hamburgada',
    name: 'Kit Hamburgada',
    description: 'Ketchup, Mostarda, Barbeque e Relish de pepino — o kit perfeito para hambúrgueres.',
    price: 99.9,
    image: '/products/kit-hamburgada.jpg',
    badge: 'KIT',
    rating: 5,
  },
  {
    id: 'pimenta-malagueta-com-pequi',
    name: 'Malagueta com Pequi',
    description: 'Combinação ousada do cerrado: malagueta intensa com o aroma inconfundível do pequi.',
    price: 28.9,
    image: '/products/malagueta-pequi.jpg',
    badge: 'ESPECIAL',
    rating: 5,
  },
];
