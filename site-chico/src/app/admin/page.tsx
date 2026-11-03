import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { formatBRL, formatDateTime, orderCode, LOW_STOCK_THRESHOLD } from '@/lib/labels';
import { OrderStatusBadge, PageTitle, StockBadge } from './_components/badges';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  await requireAdmin();

  const [toShip, pendingPayment, outOfStock, attention, recentOrders] = await Promise.all([
    prisma.order.count({ where: { status: 'CONFIRMED' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { active: true, stockQuantity: 0 } }),
    prisma.product.findMany({
      where: { active: true, stockQuantity: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stockQuantity: 'asc' },
      select: { id: true, name: true, stockQuantity: true },
    }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, status: true, total: true, createdAt: true, recipientName: true } }),
  ]);

  const cards = [
    { label: 'Pedidos para enviar', value: toShip, href: '/admin/pedidos?status=CONFIRMED', tone: toShip ? 'border-blue-500' : 'border-gray-200', help: 'Já pagos, aguardando você preparar e postar.' },
    { label: 'Aguardando pagamento', value: pendingPayment, href: '/admin/pedidos?status=PENDING', tone: 'border-yellow-400', help: 'O cliente ainda não concluiu o pagamento.' },
    { label: 'Produtos esgotados', value: outOfStock, href: '/admin/produtos?filtro=acabando', tone: outOfStock ? 'border-red-500' : 'border-gray-200', help: 'Aparecem como indisponíveis no site.' },
  ];

  return (
    <>
      <PageTitle title="Bem-vindo(a)!" subtitle="Veja o que precisa da sua atenção hoje." />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className={`bg-white shadow-sm rounded p-5 border-l-4 ${card.tone} hover:shadow-md transition-shadow`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="font-semibold mt-1">{card.label}</p>
            <p className="text-sm text-pitch/60 mt-1">{card.help}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white shadow-sm rounded p-6">
          <h2 className="font-bold text-lg mb-4">Estoque que precisa de atenção</h2>
          {attention.length === 0 ? (
            <p className="text-pitch/70">Tudo certo: nenhum produto acabando.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {attention.map((product) => (
                <li key={product.id} className="py-3 flex items-center justify-between gap-3">
                  <Link href={`/admin/produtos/${product.id}`} className="font-medium hover:text-brand">{product.name}</Link>
                  <StockBadge quantity={product.stockQuantity} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white shadow-sm rounded p-6">
          <h2 className="font-bold text-lg mb-4">Últimos pedidos</h2>
          {recentOrders.length === 0 ? (
            <p className="text-pitch/70">Ainda não há pedidos.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/admin/pedidos/${order.id}`} className="hover:text-brand">
                    <span className="font-semibold">{orderCode(order.id)}</span> · {order.recipientName}
                    <span className="block text-xs text-pitch/60">{formatDateTime(order.createdAt)} · {formatBRL(order.total)}</span>
                  </Link>
                  <OrderStatusBadge status={order.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
