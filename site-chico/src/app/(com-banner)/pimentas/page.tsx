import type { Metadata } from 'next';
import PimentasGrid from './PimentasGrid';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Pimentas Artesanais',
  description: 'Pimentas artesanais com diferentes níveis de ardência. Caseira, Dedo de Moça, Jalapeño, Sweet Chilli Chipotle e Malagueta com Pequi.',
};

export default async function Pimentas() {
  const products = await prisma.product.findMany({ where: { category: 'PIMENTA', active: true }, orderBy: { createdAt: 'asc' } });
  const produtos = products.map((p) => ({
    name: p.name, price: p.price.toString(), rating: 5, slug: p.slug, tag: p.tag ?? undefined,
    imageUrl: p.imageUrl, inStock: p.stockQuantity > 0, ardencia: p.heatLevel ?? 1,
  }));
  return <PimentasGrid produtos={produtos} />;
}

