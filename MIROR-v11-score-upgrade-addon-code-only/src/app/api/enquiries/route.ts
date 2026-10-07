import { NextResponse } from "next/server";
import { escapePlainText, safeEmail, safePhone, withinLength } from "@/lib/content-governance";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 48_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;

const memoryRateMap = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const existing = memoryRateMap.get(key);
  if (!existing || existing.resetAt <= now) {
    memoryRateMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (existing.count >= RATE_LIMIT_MAX) return false;
  existing.count += 1;
  return true;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) return jsonError("Request is too large.", 413);
  if (!checkRateLimit(clientKey(request))) return jsonError("Too many requests. Please try again shortly.", 429);

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return jsonError("Unsupported form encoding.", 415);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("The enquiry could not be read.", 400);
  }

  const name = escapePlainText(String(form.get("name") ?? ""));
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const phone = escapePlainText(String(form.get("phone") ?? ""));
  const company = escapePlainText(String(form.get("company") ?? ""));
  const message = escapePlainText(String(form.get("message") ?? ""));
  const website = String(form.get("website") ?? "").trim();

  if (website) return NextResponse.json({ ok: true });
  if (!withinLength(name, 2, 120)) return jsonError("Please enter your name.");
  if (!safeEmail(email)) return jsonError("Please enter a valid email address.");
  if (!safePhone(phone)) return jsonError("Please enter a valid phone number.");
  if (!withinLength(message, 10, 5000)) return jsonError("Please provide a little more detail about your enquiry.");
  if (!withinLength(company, 0, 160)) return jsonError("Company name is too long.");

  const id = `ENQ-${Date.now().toString(36).toUpperCase()}`;

  console.info("MIROR enquiry accepted", {
    id,
    name,
    email,
    phonePresent: Boolean(phone),
    companyPresent: Boolean(company),
    messageLength: message.length,
  });

  return NextResponse.json(
    {
      ok: true,
      enquiryId: id,
      message: "Your enquiry has been accepted for processing.",
    },
    { status: 201 },
  );
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
