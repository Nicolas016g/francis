import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'francis_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('NEXTAUTH_SECRET must contain at least 32 characters.');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createPasswordResetToken() {
  const token = randomBytes(32).toString('hex');
  return { token, tokenHash: hashPasswordResetToken(token) };
}

export function createEmailVerificationToken() {
  const token = randomBytes(32).toString('hex');
  return { token, tokenHash: hashPasswordResetToken(token) };
}

export function hashPasswordResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function getSessionUserId(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE,
};
