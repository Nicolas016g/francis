import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { ORDER_STATUS_LABELS, formatBRL, formatDateTime, orderCode } from '@/lib/labels';
import { OrderStatusBadge, PageTitle } from '../_components/badges';

export const dynamic = 'force-dynamic';

const statuses = Object.keys(ORDER_STATUS_LABELS) as Array<keyof typeof ORDER_STATUS_LABELS>;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const selected = statuses.find((value) => value === status);

  const orders = await prisma.order.findMany({
    where: selected ? { status: selected } : {},
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { items: { select: { quantity: true } } },
  });

  return (
    <>
      <PageTitle title="Pedidos" subtitle="Acompanhe as vendas e marque o que já foi enviado." />

      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar pedidos">
        <Link href="/admin/pedidos" className={`px-4 py-2 rounded-full text-sm font-semibold border ${!selected ? 'bg-pitch text-white border-pitch' : 'bg-white border-gray-300 hover:border-pitch'}`}>
          Todos
        </Link>
        {statuses.map((value) => (
          <Link
            key={value}
            href={`/admin/pedidos?status=${value}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${selected === value ? 'bg-pitch text-white border-pitch' : 'bg-white border-gray-300 hover:border-pitch'}`}
          >
            {ORDER_STATUS_LABELS[value]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="bg-white shadow-sm rounded p-6 text-pitch/70">Nenhum pedido encontrado.</p>
      ) : (
        <div className="bg-white shadow-sm rounded overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-pitch/60">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Itens</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/pedidos/${order.id}`} className="font-semibold hover:text-brand">{orderCode(order.id)}</Link>
                    <span className="block text-xs text-pitch/60">{formatDateTime(order.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">{order.recipientName}<span className="block text-xs text-pitch/60">{order.city}/{order.state}</span></td>
                  <td className="px-4 py-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatBRL(order.total)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
