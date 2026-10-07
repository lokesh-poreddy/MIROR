import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { listEnquiries } from "@/lib/supabase-rest";



export async function GET(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  try {
    const limit = Number(new URL(request.url).searchParams.get("limit") || "50");
    return NextResponse.json({ ok: true, enquiries: await listEnquiries(limit) });
  } catch {
    return NextResponse.json({ ok: false, error: "Enquiry persistence is unavailable." }, { status: 503 });
  }
}
