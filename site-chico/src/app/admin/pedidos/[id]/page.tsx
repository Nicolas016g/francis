import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { PAYMENT_STATUS_LABELS, formatBRL, formatDateTime, orderCode } from '@/lib/labels';
import { OrderStatusBadge, PageTitle } from '../../_components/badges';
import OrderShippingForm from '../../_components/OrderShippingForm';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { name: true } } } }, payment: true },
  });
  if (!order) notFound();

  return (
    <>
      <Link href="/admin/pedidos" className="text-sm text-pitch/70 hover:text-brand">← Voltar para pedidos</Link>
      <div className="mt-3">
        <PageTitle title={`Pedido ${orderCode(order.id)}`} subtitle={`Feito em ${formatDateTime(order.createdAt)}`}>
          <OrderStatusBadge status={order.status} />
        </PageTitle>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white shadow-sm rounded p-6">
            <h2 className="font-bold text-lg mb-4">O que separar</h2>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between gap-3">
                  <span><strong>{item.quantity}×</strong> {item.product.name}</span>
                  <span className="text-pitch/70">{formatBRL(Number(item.unitPrice) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm">
              <div className="flex justify-between"><dt>Produtos</dt><dd>{formatBRL(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Frete ({order.shippingService ?? 'não informado'})</dt><dd>{formatBRL(order.shippingCost)}</dd></div>
              <div className="flex justify-between font-bold text-base"><dt>Total</dt><dd>{formatBRL(order.total)}</dd></div>
            </dl>
          </section>

          <section className="bg-white shadow-sm rounded p-6">
            <h2 className="font-bold text-lg mb-4">Entregar para</h2>
            <address className="not-italic leading-relaxed">
              <strong>{order.recipientName}</strong><br />
              {order.street}, {order.number}{order.complement ? ` — ${order.complement}` : ''}<br />
              {order.neighborhood} — {order.city}/{order.state}<br />
              CEP {order.postalCode}
            </address>
            <p className="text-sm text-pitch/70 mt-3">
              {order.recipientEmail}{order.recipientPhone ? ` · ${order.recipientPhone}` : ''}
            </p>
            {order.deliveryDays !== null && (
              <p className="text-sm text-pitch/70 mt-1">Prazo informado ao cliente: {order.deliveryDays} dias úteis.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white shadow-sm rounded p-6">
            <h2 className="font-bold text-lg mb-2">Pagamento</h2>
            <p>{order.payment ? PAYMENT_STATUS_LABELS[order.payment.status] : 'Sem registro'}</p>
          </section>

          <section className="bg-white shadow-sm rounded p-6">
            <h2 className="font-bold text-lg mb-4">Envio</h2>
            {order.status === 'CONFIRMED' && <OrderShippingForm orderId={order.id} step="ship" />}
            {order.status === 'SHIPPED' && (
              <>
                {order.shippingReference && <p className="mb-4 text-sm">Rastreio: <strong>{order.shippingReference}</strong></p>}
                <OrderShippingForm orderId={order.id} step="deliver" />
              </>
            )}
            {order.status === 'DELIVERED' && (
              <p className="text-sm">Pedido entregue.{order.shippingReference ? ` Rastreio: ${order.shippingReference}.` : ''}</p>
            )}
            {order.status === 'PENDING' && <p className="text-sm text-pitch/70">Aguardando o pagamento. Ainda não precisa enviar nada.</p>}
            {order.status === 'CANCELLED' && <p className="text-sm text-pitch/70">Pedido cancelado. Os produtos voltaram para o estoque.</p>}
          </section>
        </aside>
      </div>
    </>
  );
}
