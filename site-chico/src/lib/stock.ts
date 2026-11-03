import { Prisma, StockMovementReason } from '@/generated/prisma/client';

interface StockChange {
  productId: string;
  delta: number;
  reason: StockMovementReason;
  note?: string | null;
  orderId?: string | null;
  createdById?: string | null;
}

/**
 * Altera o estoque de um produto e registra a movimentação na mesma transação.
 * Retorna o novo saldo, ou null se a saída deixaria o estoque negativo.
 */
export async function applyStockChange(tx: Prisma.TransactionClient, change: StockChange) {
  if (change.delta === 0) return null;

  const updated = await tx.product.updateMany({
    where: {
      id: change.productId,
      ...(change.delta < 0 ? { stockQuantity: { gte: -change.delta } } : {}),
    },
    data: { stockQuantity: { increment: change.delta } },
  });
  if (updated.count !== 1) return null;

  const product = await tx.product.findUniqueOrThrow({
    where: { id: change.productId },
    select: { stockQuantity: true },
  });
  await tx.stockMovement.create({
    data: {
      productId: change.productId,
      delta: change.delta,
      balanceAfter: product.stockQuantity,
      reason: change.reason,
      note: change.note ?? null,
      orderId: change.orderId ?? null,
      createdById: change.createdById ?? null,
    },
  });
  return product.stockQuantity;
}
