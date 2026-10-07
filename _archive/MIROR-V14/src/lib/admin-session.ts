import { cookies } from "next/headers";
import { createHmac, pbkdf2Sync, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "miror_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const PASSWORD_KEY_LENGTH = 32;

type SessionPayload = {
  email: string;
  iat: number;
  exp: number;
};

function getSecret() {
  const secret = process.env.MIROR_ADMIN_SESSION_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function passwordConfig() {
  const email = process.env.MIROR_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.MIROR_ADMIN_PASSWORD_HASH?.trim();
  const secret = getSecret();
  return email && passwordHash && secret ? { email, passwordHash, secret } : null;
}

function verifyPassword(password: string, encoded: string) {
  const parts = encoded.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;

  const iterations = Number(parts[1]);
  const salt = parts[2];
  const expected = Buffer.from(parts[3], "base64url");
  if (!Number.isInteger(iterations) || iterations < 100_000 || !salt || expected.length !== PASSWORD_KEY_LENGTH) return false;

  const derived = pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, "sha256");
  return timingSafeEqual(derived, expected);
}

export function isAdminConfigured() {
  return Boolean(passwordConfig());
}

export function authenticateAdmin(email: string, password: string) {
  const config = passwordConfig();
  if (!config) return false;
  const normalized = email.trim().toLowerCase();
  return safeEqual(normalized, config.email) && verifyPassword(password, config.passwordHash);
}

export function createAdminSession(email: string) {
  const secret = getSecret();
  if (!secret) throw new Error("Admin session secret is not configured.");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    email: email.trim().toLowerCase(),
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  })).toString("base64url");
  return { value: `${payload}.${sign(payload, secret)}`, maxAge: SESSION_TTL_SECONDS };
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const secret = getSecret();
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const split = token.lastIndexOf(".");
  if (split <= 0) return null;
  const payloadPart = token.slice(0, split);
  const signaturePart = token.slice(split + 1);
  if (!safeEqual(signaturePart, sign(payloadPart, secret))) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.email !== "string" || typeof payload.iat !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const adminSessionCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
};
