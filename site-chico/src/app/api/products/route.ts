import { NextRequest, NextResponse } from 'next/server';
import { ProductCategory } from '@/generated/prisma/client';
import { findActiveProducts } from '@/lib/products';

const categories = new Set(Object.values(ProductCategory));

function serializeProduct(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: { toString(): string };
  originalPrice: { toString(): string } | null;
  imageUrl: string | null;
  tag: string | null;
  heatLevel: number | null;
  sauceType: string | null;
  stockQuantity: number;
  active: boolean;
  weightGrams: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
}) {
  return {
    ...product,
    price: product.price.toString(),
    originalPrice: product.originalPrice?.toString() ?? null,
    inStock: product.stockQuantity > 0,
  };
}

export async function GET(request: NextRequest) {
  const categoryParam = request.nextUrl.searchParams.get('category')?.toUpperCase();
  const search = request.nextUrl.searchParams.get('search')?.trim();

  if (categoryParam && !categories.has(categoryParam as ProductCategory)) {
    return NextResponse.json({ error: 'Categoria inválida.' }, { status: 400 });
  }
  if (search && search.length > 100) {
    return NextResponse.json({ error: 'A busca deve ter no máximo 100 caracteres.' }, { status: 400 });
  }

  const products = await findActiveProducts({
    category: categoryParam as ProductCategory | undefined,
    search,
  });

  return NextResponse.json({ products: products.map(serializeProduct) });
}
