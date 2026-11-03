import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { STOCK_REASON_LABELS, formatDateTime } from '@/lib/labels';
import { PageTitle, StockBadge } from '../../_components/badges';
import ProductForm from '../../_components/ProductForm';
import StockForm from '../../_components/StockForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { novo } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { stockMovements: { orderBy: { createdAt: 'desc' }, take: 15 } },
  });
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/produtos" className="text-sm text-pitch/70 hover:text-brand">← Voltar para produtos</Link>
      {novo && <p role="status" className="mt-3 bg-green-50 text-green-800 px-4 py-3 rounded font-medium">Produto cadastrado com sucesso!</p>}
      <div className="mt-3">
        <PageTitle title={product.name} subtitle={product.active ? 'Visível no site.' : 'Oculto no site.'}>
          <StockBadge quantity={product.stockQuantity} />
        </PageTitle>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductForm
            values={{
              id: product.id,
              name: product.name,
              description: product.description,
              category: product.category,
              price: product.price.toFixed(2).replace('.', ','),
              originalPrice: product.originalPrice ? product.originalPrice.toFixed(2).replace('.', ',') : '',
              imageUrl: product.imageUrl ?? '',
              tag: product.tag ?? '',
              sauceType: product.sauceType ?? '',
              heatLevel: product.heatLevel?.toString() ?? '',
              weightGrams: String(product.weightGrams),
              heightCm: String(product.heightCm),
              widthCm: String(product.widthCm),
              lengthCm: String(product.lengthCm),
              active: product.active,
            }}
          />
        </div>

        <aside className="space-y-6">
          <section className="bg-white shadow-sm rounded p-6">
            <h2 className="font-bold text-lg mb-4">Ajustar estoque</h2>
            <StockForm productId={product.id} current={product.stockQuantity} />
          </section>

          <section className="bg-white shadow-sm rounded p-6">
            <h2 className="font-bold text-lg mb-4">Últimas movimentações</h2>
            {product.stockMovements.length === 0 ? (
              <p className="text-sm text-pitch/70">Nenhuma movimentação registrada.</p>
            ) : (
              <ul className="divide-y divide-gray-100 text-sm">
                {product.stockMovements.map((movement) => (
                  <li key={movement.id} className="py-2">
                    <div className="flex justify-between gap-2">
                      <span>{STOCK_REASON_LABELS[movement.reason]}</span>
                      <strong className={movement.delta > 0 ? 'text-green-700' : 'text-red-700'}>
                        {movement.delta > 0 ? '+' : ''}{movement.delta}
                      </strong>
                    </div>
                    <span className="text-xs text-pitch/60">{formatDateTime(movement.createdAt)} · saldo {movement.balanceAfter}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
