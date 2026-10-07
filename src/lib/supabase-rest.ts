export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  enquiry_type: string;
  message: string;
  notification_status: "pending" | "sent" | "failed" | "not_configured";
  notification_id: string | null;
  notification_sent_at: string | null;
  created_at: string;
};

function config() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export function isPersistenceConfigured() {
  return Boolean(config());
}

async function request<T>(path: string, init: RequestInit = {}) {
  const value = config();
  if (!value) throw new Error("Supabase persistence is not configured.");
  const headers = new Headers(init.headers);
  headers.set("apikey", value.key);
  headers.set("Authorization", `Bearer ${value.key}`);
  headers.set("Content-Type", "application/json");
  const response = await fetch(`${value.url}/rest/v1/${path}`, { ...init, headers, cache: "no-store" });
  const body = await response.text();
  let parsed: unknown = null;
  try { parsed = body ? JSON.parse(body) : null; } catch { parsed = body; }
  if (!response.ok) {
    const message = typeof parsed === "object" && parsed && "message" in parsed && typeof (parsed as { message?: unknown }).message === "string"
      ? (parsed as { message: string }).message
      : "Supabase request failed.";
    throw new Error(message);
  }
  return parsed as T;
}

export async function insertEnquiry(input: Omit<EnquiryRow, "created_at" | "notification_status" | "notification_id" | "notification_sent_at">) {
  const rows = await request<EnquiryRow[]>("enquiries", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify([{ ...input, notification_status: "pending" }]),
  });
  if (!rows[0]) throw new Error("The enquiry was not returned after persistence.");
  return rows[0];
}

export async function updateEnquiryNotification(id: string, status: EnquiryRow["notification_status"], notificationId: string | null) {
  await request(`enquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      notification_status: status,
      notification_id: notificationId,
      notification_sent_at: status === "sent" ? new Date().toISOString() : null,
    }),
  });
}

export async function listEnquiries(limit = 50) {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 100);
  return request<EnquiryRow[]>(
    `enquiries?select=id,name,email,company_name,phone,enquiry_type,message,notification_status,notification_id,notification_sent_at,created_at&order=created_at.desc&limit=${safeLimit}`,
  );
}
