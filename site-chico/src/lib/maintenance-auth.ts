import { timingSafeEqual } from 'node:crypto';
import { NextRequest } from 'next/server';

function getMaintenanceSecret() {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('CRON_SECRET must contain at least 32 characters.');
  }
  return secret;
}

function secureEqual(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export function hasValidMaintenanceSecret(request: NextRequest) {
  const authorization = request.headers.get('authorization') ?? '';
  const headerSecret = request.headers.get('x-cron-secret') ?? '';
  const bearerSecret = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  const receivedSecret = bearerSecret || headerSecret;

  return Boolean(receivedSecret) && secureEqual(receivedSecret, getMaintenanceSecret());
}
