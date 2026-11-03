export const ORDER_STATUS_LABELS = {
  PENDING: 'Aguardando pagamento',
  CONFIRMED: 'Pago — preparar envio',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
} as const;

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
  CANCELLED: 'Cancelado',
} as const;

export const CATEGORY_LABELS = {
  PIMENTA: 'Pimenta',
  MOLHO: 'Molho',
  KIT: 'Kit',
} as const;

export const STOCK_REASON_LABELS = {
  ENTRY: 'Entrada de produtos',
  OUTPUT: 'Saída manual',
  LOSS: 'Perda ou avaria',
  CORRECTION: 'Correção de contagem',
  ORDER_RESERVED: 'Reservado por pedido',
  ORDER_RELEASED: 'Devolvido (pedido cancelado)',
} as const;

export const LOW_STOCK_THRESHOLD = 5;

export function formatBRL(value: number | string | { toString(): string }) {
  return Number(value.toString()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDateTime(date: Date) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

export function orderCode(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}
