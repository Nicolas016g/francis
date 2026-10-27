import { createHmac, timingSafeEqual } from 'node:crypto';

const QUOTE_TTL_MS = 15 * 60 * 1000;

export interface ShippingQuote {
  cep: string;
  itemKey: string;
  optionId: number;
  price: number;
  service: string;
  deliveryDays: number;
  expiresAt: number;
}

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('NEXTAUTH_SECRET must contain at least 32 characters.');
  }
  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', getSigningSecret()).update(payload).digest('base64url');
}

export function createShippingQuote(input: Omit<ShippingQuote, 'expiresAt'>) {
  const quote = { ...input, expiresAt: Date.now() + QUOTE_TTL_MS };
  const payload = Buffer.from(JSON.stringify(quote)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyShippingQuote(token: string | undefined): ShippingQuote | null {
  if (!token) return null;
  const [payload, receivedSignature] = token.split('.');
  if (!payload || !receivedSignature) return null;

  const expectedSignature = sign(payload);
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const quote = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as ShippingQuote;
    if (
      typeof quote.cep !== 'string' ||
      typeof quote.itemKey !== 'string' ||
      !Number.isInteger(quote.optionId) ||
      !Number.isFinite(quote.price) ||
      quote.price < 0 ||
      typeof quote.service !== 'string' ||
      !Number.isInteger(quote.deliveryDays) ||
      quote.deliveryDays < 0 ||
      !Number.isFinite(quote.expiresAt) ||
      quote.expiresAt < Date.now()
    ) {
      return null;
    }
    return quote;
  } catch {
    return null;
  }
}
