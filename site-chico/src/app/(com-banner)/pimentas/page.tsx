import type { Metadata } from 'next';
import PimentasGrid from './PimentasGrid';
import { prisma } from '@/lib/prisma';
import { getProductCover } from '@/lib/product-images';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pimentas Artesanais',
  description: 'Pimentas artesanais com diferentes níveis de ardência: Caseira, Dedo de Moça e Jalapeño.',
};

export default async function Pimentas() {
  const products = await prisma.product.findMany({ where: { category: 'PIMENTA', active: true }, orderBy: { createdAt: 'asc' } });
  const produtos = products.map((p) => ({
    name: p.name, price: p.price.toString(), rating: 5, slug: p.slug, tag: p.tag ?? undefined,
    imageUrl: getProductCover(p.slug, p.imageUrl), inStock: p.stockQuantity > 0, ardencia: p.heatLevel ?? 1,
  }));
  return <PimentasGrid produtos={produtos} />;
}
