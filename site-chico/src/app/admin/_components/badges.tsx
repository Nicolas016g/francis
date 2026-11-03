import { ORDER_STATUS_LABELS, LOW_STOCK_THRESHOLD } from '@/lib/labels';

const statusColors: Record<keyof typeof ORDER_STATUS_LABELS, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-200 text-gray-700',
};

export function OrderStatusBadge({ status }: { status: keyof typeof ORDER_STATUS_LABELS }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function StockBadge({ quantity }: { quantity: number }) {
  const tone =
    quantity === 0
      ? 'bg-red-100 text-red-800'
      : quantity <= LOW_STOCK_THRESHOLD
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800';
  const label = quantity === 0 ? 'Esgotado' : quantity <= LOW_STOCK_THRESHOLD ? 'Acabando' : 'Em estoque';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${tone}`}>
      {quantity} · {label}
    </span>
  );
}

export function PageTitle({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-pitch/70 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
