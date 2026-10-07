import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { escapePlainText, safeEmail, safePhone, withinLength } from "@/lib/content-governance";
import { insertEnquiry, isPersistenceConfigured, updateEnquiryNotification } from "@/lib/supabase-rest";
import { isEmailNotificationConfigured, sendEnquiryNotification } from "@/lib/notifications";

const MAX_BODY_BYTES = 48_000;
const WINDOW_MS = 60_000;
const LIMIT = 8;
const rates = new Map<string, { count: number; resetAt: number }>();
const types = new Set(["General enquiry", "Project enquiry", "Partnership enquiry", "Career enquiry", "Document request"]);

function key(request: Request) {
  const value = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
  return createHash("sha256").update(value).digest("hex");
}
function allowed(value: string) {
  const now = Date.now(); const entry = rates.get(value);
  if (!entry || entry.resetAt <= now) { rates.set(value, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  if (entry.count >= LIMIT) return false; entry.count += 1; return true;
}
function error(message: string, status = 400) { return NextResponse.json({ ok: false, error: message }, { status }); }

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) return error("Request is too large.", 413);
  if (!allowed(key(request))) return error("Too many requests. Please try again shortly.", 429);
  if (!isPersistenceConfigured()) return error("The enquiry service is not configured. Please use the direct email option.", 503);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) return error("Unsupported form encoding.", 415);

  const form = await request.formData().catch(() => null);
  if (!form) return error("The enquiry could not be read.");
  if (String(form.get("website") || "").trim()) return NextResponse.json({ ok: true });

  const name = escapePlainText(String(form.get("name") || ""));
  const email = String(form.get("email") || "").trim().toLowerCase();
  const phone = escapePlainText(String(form.get("phone") || ""));
  const company = escapePlainText(String(form.get("company") || ""));
  const enquiryType = escapePlainText(String(form.get("enquiryType") || ""));
  const message = escapePlainText(String(form.get("message") || ""));

  if (!withinLength(name, 2, 120)) return error("Please enter your name.");
  if (!safeEmail(email)) return error("Please enter a valid email address.");
  if (!safePhone(phone)) return error("Please enter a valid phone number.");
  if (!withinLength(company, 0, 160)) return error("Company name is too long.");
  if (!types.has(enquiryType)) return error("Please select a valid enquiry type.");
  if (!withinLength(message, 10, 5000)) return error("Please provide a little more detail about your enquiry.");

  const id = randomUUID();
  try {
    await insertEnquiry({ id, name, email, company_name: company || null, phone: phone || null, enquiry_type: enquiryType, message });
  } catch (cause) {
    console.error("MIROR enquiry persistence failed", cause);
    return error("The enquiry could not be stored. Please use the direct email option.", 503);
  }

  let notificationStatus: "sent" | "failed" | "not_configured" = "not_configured";
  let notificationId: string | null = null;
  try {
    if (isEmailNotificationConfigured()) {
      const result = await sendEnquiryNotification({ id, name, email, companyName: company, phone, enquiryType, message });
      notificationStatus = result.status; notificationId = result.id;
    }
  } catch (cause) {
    console.error("MIROR enquiry notification failed", { enquiryId: id, cause });
    notificationStatus = "failed";
  }
  await updateEnquiryNotification(id, notificationStatus, notificationId).catch((cause) => console.error("MIROR enquiry notification state update failed", cause));

  return NextResponse.json({
    ok: true, enquiryId: id,
    message: notificationStatus === "sent"
      ? "Your enquiry has been received. The Miror team has been notified."
      : "Your enquiry has been securely recorded. Team notification still requires configuration or retry.",
  }, { status: 201 });
}

export async function GET() { return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 }); }
