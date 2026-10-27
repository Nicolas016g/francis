'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProduct {
  name: string;
  price: string;
  slug: string;
  image: string;
  badge?: string;
}

interface HeroCarouselProps {
  products: CarouselProduct[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  products,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlay, products.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  if (products.length === 0) return null;

  return (
    <div
      className="relative w-full h-72 overflow-hidden bg-white/5 border border-white/10 group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Carrossel de Imagens */}
      <div className="relative w-full h-full">
        {products.map((product, index) => (
          <Link
            key={product.slug}
            href={`/produto/${product.slug}`}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              pointerEvents: index === currentIndex ? 'auto' : 'none',
            }}
          >
            <div className="relative w-full h-full bg-gradient-to-br from-brand/20 to-pitch/20">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-pitch/80 via-pitch/40 to-transparent" />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-20 bg-brand text-white px-3 py-1 text-xs font-bold uppercase">
                  {product.badge}
                </div>
              )}

              {/* Informações do Produto */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg font-bold mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-brand">
                  {product.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Botões de Navegação */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/20 hover:bg-brand text-white p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Produto anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/20 hover:bg-brand text-white p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Próximo produto"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 z-20 flex gap-2 -translate-x-1/2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 transition-all duration-300 ${
              index === currentIndex
                ? 'bg-brand w-8'
                : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
            aria-label={`Ir para produto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
