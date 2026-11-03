'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma, ProductCategory } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { applyStockChange } from '@/lib/stock';

export type ActionState = { ok: boolean; message: string } | null;

const fail = (message: string): ActionState => ({ ok: false, message });
const succeed = (message: string): ActionState => ({ ok: true, message });

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

// Aceita "28,90", "1.234,50" e "28.90".
function parseMoney(value: string) {
  if (!value) return null;
  const compact = value.replace(/\s/g, '');
  const number = compact.includes(',') ? Number(compact.replace(/\./g, '').replace(',', '.')) : Number(compact);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : NaN;
}

function parseInteger(value: string) {
  return /^\d+$/.test(value) ? Number(value) : NaN;
}

function slugify(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function uniqueSlug(name: string) {
  const base = slugify(name) || 'produto';
  for (let suffix = 1; suffix < 50; suffix += 1) {
    const slug = suffix === 1 ? base : `${base}-${suffix}`;
    if (!(await prisma.product.findUnique({ where: { slug }, select: { id: true } }))) return slug;
  }
  return `${base}-${Date.now()}`;
}

function refreshStorefront() {
  revalidatePath('/', 'layout');
}

export async function saveProduct(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();

  const id = text(formData, 'id');
  const name = text(formData, 'name');
  const description = text(formData, 'description');
  const category = text(formData, 'category') as ProductCategory;
  const price = parseMoney(text(formData, 'price'));
  const originalPrice = parseMoney(text(formData, 'originalPrice'));
  const imageUrl = text(formData, 'imageUrl');
  const tag = text(formData, 'tag');
  const sauceType = text(formData, 'sauceType');
  const heatText = text(formData, 'heatLevel');
  const heatLevel = heatText ? parseInteger(heatText) : null;
  const weightGrams = parseInteger(text(formData, 'weightGrams'));
  const heightCm = parseInteger(text(formData, 'heightCm'));
  const widthCm = parseInteger(text(formData, 'widthCm'));
  const lengthCm = parseInteger(text(formData, 'lengthCm'));
  const active = formData.get('active') === 'on';
  const initialStock = id ? 0 : parseInteger(text(formData, 'initialStock') || '0');

  if (name.length < 2 || name.length > 100) return fail('Informe o nome do produto (até 100 letras).');
  if (description.length < 10 || description.length > 2000) return fail('A descrição precisa ter entre 10 e 2000 letras.');
  if (!['PIMENTA', 'MOLHO', 'KIT'].includes(category)) return fail('Escolha o tipo do produto.');
  if (price === null || !Number.isFinite(price) || price <= 0 || price > 99999) return fail('Informe um preço válido, por exemplo 28,90.');
  if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice <= price)) {
    return fail('O preço "de" (antes da promoção) precisa ser maior que o preço atual. Deixe em branco se não houver promoção.');
  }
  if (imageUrl && !/^(\/|https:\/\/)\S+$/.test(imageUrl)) return fail('O link da foto deve começar com / ou https://.');
  if (tag.length > 30 || sauceType.length > 40) return fail('Etiqueta ou estilo muito longo.');
  if (heatLevel !== null && (!Number.isInteger(heatLevel) || heatLevel < 1 || heatLevel > 5)) return fail('A ardência vai de 1 a 5.');
  if (![weightGrams, heightCm, widthCm, lengthCm].every((value) => Number.isInteger(value) && value > 0 && value < 100000)) {
    return fail('Informe peso e medidas da embalagem (números maiores que zero). Eles são usados para calcular o frete.');
  }
  if (!Number.isInteger(initialStock) || initialStock < 0 || initialStock > 100000) return fail('Estoque inicial inválido.');

  const data = {
    name,
    description,
    category,
    price,
    originalPrice,
    imageUrl: imageUrl || null,
    tag: tag || null,
    sauceType: sauceType || null,
    heatLevel,
    weightGrams,
    heightCm,
    widthCm,
    lengthCm,
    active,
  };

  if (id) {
    try {
      await prisma.product.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return fail('Produto não encontrado.');
      throw error;
    }
    refreshStorefront();
    revalidatePath('/admin', 'layout');
    return succeed('Alterações salvas.');
  }

  const slug = await uniqueSlug(name);
  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({ data: { ...data, slug, stockQuantity: 0 } });
    if (initialStock > 0) {
      await applyStockChange(tx, {
        productId: created.id,
        delta: initialStock,
        reason: 'ENTRY',
        note: 'Estoque inicial',
        createdById: admin.id,
      });
    }
    return created;
  });
  refreshStorefront();
  redirect(`/admin/produtos/${product.id}?novo=1`);
}

const STOCK_ACTIONS = ['ENTRY', 'OUTPUT', 'LOSS', 'COUNT'] as const;

export async function adjustStock(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();

  const productId = text(formData, 'productId');
  const type = text(formData, 'type') as (typeof STOCK_ACTIONS)[number];
  const quantity = parseInteger(text(formData, 'quantity'));
  const note = text(formData, 'note').slice(0, 190);

  if (!STOCK_ACTIONS.includes(type)) return fail('Escolha o que aconteceu com o estoque.');
  if (!Number.isInteger(quantity) || quantity > 100000) return fail('Informe a quantidade em número inteiro.');
  if (type !== 'COUNT' && quantity < 1) return fail('A quantidade precisa ser de pelo menos 1.');

  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId }, select: { stockQuantity: true, name: true } });
    if (!product) return fail('Produto não encontrado.');

    const delta = type === 'COUNT' ? quantity - product.stockQuantity : type === 'ENTRY' ? quantity : -quantity;
    if (delta === 0) return fail('O estoque já está com essa quantidade.');

    const balance = await applyStockChange(tx, {
      productId,
      delta,
      reason: type === 'COUNT' ? 'CORRECTION' : type,
      note: note || null,
      createdById: admin.id,
    });
    if (balance === null) return fail(`Não há ${quantity} unidades para retirar. Hoje há ${product.stockQuantity}.`);
    return succeed(`Pronto! ${product.name} agora tem ${balance} em estoque.`);
  });

  if (result?.ok) {
    revalidatePath('/admin', 'layout');
    refreshStorefront();
  }
  return result;
}

export async function setProductActive(formData: FormData) {
  await requireAdmin();
  const productId = text(formData, 'productId');
  const active = text(formData, 'active') === 'true';
  await prisma.product.updateMany({ where: { id: productId }, data: { active } });
  revalidatePath('/admin', 'layout');
  refreshStorefront();
}

export async function updateOrderShipping(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const orderId = text(formData, 'orderId');
  const step = text(formData, 'step');
  const trackingCode = text(formData, 'trackingCode').slice(0, 100);

  if (step === 'ship') {
    const updated = await prisma.order.updateMany({
      where: { id: orderId, status: 'CONFIRMED' },
      data: { status: 'SHIPPED', shippingReference: trackingCode || null },
    });
    if (updated.count !== 1) return fail('Este pedido não está mais aguardando envio. Atualize a página.');
  } else if (step === 'deliver') {
    const updated = await prisma.order.updateMany({ where: { id: orderId, status: 'SHIPPED' }, data: { status: 'DELIVERED' } });
    if (updated.count !== 1) return fail('Este pedido não está marcado como enviado. Atualize a página.');
  } else {
    return fail('Ação inválida.');
  }

  revalidatePath('/admin', 'layout');
  revalidatePath('/minha-conta');
  return succeed(step === 'ship' ? 'Pedido marcado como enviado.' : 'Pedido marcado como entregue.');
}
