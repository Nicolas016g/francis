'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  productName?: string;
}

export default function ProductGallery({ productName = 'Produto' }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 4 imagens do produto
  const images = [
    { id: 1, emoji: '🌶️' },
    { id: 2, emoji: '🌶️' },
    { id: 3, emoji: '🌶️' },
    { id: 4, emoji: '🌶️' },
  ];

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative bg-off-white h-96 flex items-center justify-center text-9xl overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center">
          {images[selectedImageIndex].emoji}
        </div>

        {/* Botões de Navegação */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-brand text-pitch hover:text-white p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-brand text-pitch hover:text-white p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicador de Posição */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 text-xs rounded">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-16 h-16 flex items-center justify-center text-2xl border-2 transition-all cursor-pointer ${
              index === selectedImageIndex
                ? 'border-brand bg-off-white'
                : 'border-transparent bg-off-white hover:border-brand/50'
            }`}
            aria-label={`Imagem ${index + 1}`}
            aria-current={index === selectedImageIndex}
          >
            {image.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
