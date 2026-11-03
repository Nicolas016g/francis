import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { CATEGORY_LABELS, formatBRL, LOW_STOCK_THRESHOLD } from '@/lib/labels';
import { setProductActive } from '../actions';
import { PageTitle, StockBadge } from '../_components/badges';

export const dynamic = 'force-dynamic';

const filters = [
  { value: '', label: 'Todos' },
  { value: 'acabando', label: 'Esgotados ou acabando' },
  { value: 'ocultos', label: 'Ocultos no site' },
];

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ filtro?: string }> }) {
  await requireAdmin();
  const { filtro = '' } = await searchParams;

  const products = await prisma.product.findMany({
    where:
      filtro === 'acabando'
        ? { active: true, stockQuantity: { lte: LOW_STOCK_THRESHOLD } }
        : filtro === 'ocultos'
          ? { active: false }
          : {},
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
      <PageTitle title="Produtos e estoque" subtitle="Cadastre produtos, ajuste preços e confira quanto há de cada um.">
        <Link href="/admin/produtos/novo" className="bg-brand hover:bg-brand-dark text-white font-bold px-5 py-3 rounded">
          + Novo produto
        </Link>
      </PageTitle>

      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar produtos">
        {filters.map((item) => (
          <Link
            key={item.value}
            href={item.value ? `/admin/produtos?filtro=${item.value}` : '/admin/produtos'}
            aria-current={filtro === item.value ? 'true' : undefined}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${filtro === item.value ? 'bg-pitch text-white border-pitch' : 'bg-white border-gray-300 hover:border-pitch'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="bg-white shadow-sm rounded p-6 text-pitch/70">Nenhum produto encontrado.</p>
      ) : (
        <div className="bg-white shadow-sm rounded overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-pitch/60">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">No site</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/produtos/${product.id}`} className="font-semibold hover:text-brand">{product.name}</Link>
                    <span className="block text-xs text-pitch/60">{CATEGORY_LABELS[product.category]}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatBRL(product.price)}</td>
                  <td className="px-4 py-3"><StockBadge quantity={product.stockQuantity} /></td>
                  <td className="px-4 py-3 text-sm">{product.active ? 'Visível' : 'Oculto'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/produtos/${product.id}`} className="border border-gray-300 hover:border-pitch px-3 py-1.5 rounded text-sm font-semibold">
                        Editar / estoque
                      </Link>
                      <form action={setProductActive}>
                        <input type="hidden" name="productId" value={product.id} />
                        <input type="hidden" name="active" value={String(!product.active)} />
                        <button type="submit" className="border border-gray-300 hover:border-pitch px-3 py-1.5 rounded text-sm">
                          {product.active ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-sm text-pitch/60 mt-4">
        Os kits têm estoque próprio: ao montar um kit, registre a entrada do kit e a saída dos produtos usados.
      </p>
    </>
  );
}
