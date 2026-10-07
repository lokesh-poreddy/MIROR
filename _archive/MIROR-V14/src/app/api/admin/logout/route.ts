import { NextResponse } from "next/server";
import { adminSessionCookie } from "@/lib/admin-session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin-login", request.url), 303);
  response.cookies.set(adminSessionCookie.name, "", { ...adminSessionCookie.options, maxAge: 0 });
  return response;
}

export async function GET() { return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 }); }
