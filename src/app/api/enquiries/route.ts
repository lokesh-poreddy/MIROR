import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!name || !email || !message) return NextResponse.json({ ok:false, error:"Name, email and message are required." }, { status:400 });
    if (name.length > 120 || email.length > 320 || message.length > 5000) return NextResponse.json({ ok:false, error:"Input exceeds the allowed length." }, { status:400 });
    // Integration phase: persist to PostgreSQL and send transactional email after secrets are configured.
    return NextResponse.json({ ok:true });
  } catch {
    return NextResponse.json({ ok:false, error:"Invalid request." }, { status:400 });
  }
}
