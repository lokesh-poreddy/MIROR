import { NextResponse } from "next/server";
import { adminSessionCookie, authenticateAdmin, createAdminSession, isAdminConfigured } from "@/lib/admin-session";
import { siteOrigin } from "@/lib/site-config";

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous"; }
function originAllowed(request: Request) { const origin = request.headers.get("origin"); return !origin || origin === siteOrigin(); }
function allowed(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) { attempts.set(key, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  if (entry.count >= LIMIT) return false;
  entry.count += 1; return true;
}

export async function POST(request: Request) {
  if (!originAllowed(request)) return NextResponse.json({ ok: false, error: "Origin rejected." }, { status: 403 });
  if (!allowed(clientKey(request))) return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429, headers: { "Retry-After": "900" } });
  if (!isAdminConfigured()) return NextResponse.json({ ok: false, error: "Admin access is not configured." }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const email = String(form?.get("email") ?? "");
  const password = String(form?.get("password") ?? "");
  if (!authenticateAdmin(email, password)) return NextResponse.redirect(new URL("/admin-login?error=1", request.url), 303);

  const session = createAdminSession(email);
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(adminSessionCookie.name, session.value, { ...adminSessionCookie.options, maxAge: session.maxAge });
  return response;
}
