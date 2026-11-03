import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { STOCK_REASON_LABELS, formatDateTime, orderCode } from '@/lib/labels';
import { PageTitle } from '../_components/badges';

export const dynamic = 'force-dynamic';

export default async function StockHistoryPage() {
  await requireAdmin();

  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { product: { select: { id: true, name: true } } },
  });

  return (
    <>
      <PageTitle title="Histórico de estoque" subtitle="Tudo o que entrou e saiu, com data e saldo. Mostrando as 100 movimentações mais recentes." />

      {movements.length === 0 ? (
        <p className="bg-white shadow-sm rounded p-6 text-pitch/70">Ainda não há movimentações.</p>
      ) : (
        <div className="bg-white shadow-sm rounded overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-pitch/60">
              <tr>
                <th className="px-4 py-3">Quando</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">O que aconteceu</th>
                <th className="px-4 py-3 text-right">Quantidade</th>
                <th className="px-4 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(movement.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/produtos/${movement.product.id}`} className="font-medium hover:text-brand">{movement.product.name}</Link>
                  </td>
                  <td className="px-4 py-3">
                    {STOCK_REASON_LABELS[movement.reason]}
                    {movement.orderId && (
                      <Link href={`/admin/pedidos/${movement.orderId}`} className="ml-1 text-brand">({orderCode(movement.orderId)})</Link>
                    )}
                    {movement.note && <span className="block text-xs text-pitch/60">{movement.note}</span>}
                  </td>
                  <td className={`px-4 py-3 text-right font-bold ${movement.delta > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {movement.delta > 0 ? '+' : ''}{movement.delta}
                  </td>
                  <td className="px-4 py-3 text-right">{movement.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
