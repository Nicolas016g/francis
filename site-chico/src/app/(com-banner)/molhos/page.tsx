import type { Metadata } from 'next';
import MolhosGrid from './MolhosGrid';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Molhos Autorais',
  description: "Molhos artesanais únicos: Ketchup, Mostarda, Barbecue, Cebola Caramelizada e Relish de Pepino. Receitas autorais da Franci's Creative Kitchen.",
};

export default async function Molhos() {
  const products = await prisma.product.findMany({ where: { category: 'MOLHO', active: true }, orderBy: { createdAt: 'asc' } });
  const produtos = products.map((p) => ({
    name: p.name, price: p.price.toString(), rating: 5, slug: p.slug, tag: p.tag ?? undefined,
    imageUrl: p.imageUrl, inStock: p.stockQuantity > 0, tipo: p.sauceType ?? 'Clássico',
  }));
  return <MolhosGrid produtos={produtos} />;
}
