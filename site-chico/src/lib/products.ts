import type { ProductCategory } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function findActiveProducts({
  category,
  search,
}: {
  category?: ProductCategory;
  search?: string;
} = {}) {
  const normalizedSearch = search?.trim();

  return prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch } },
              { description: { contains: normalizedSearch } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'asc' },
  });
}
