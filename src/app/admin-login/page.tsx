import type { Metadata } from "next";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-session";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };

async function LoginForm({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdminSession()) redirect("/admin");
  const params = await searchParams;
  const configured = isAdminConfigured();
  return (
    <div className="v14-admin-login-card">
      <span className="v12-kicker">Secure sign in</span>
      {!configured ? <div className="v14-admin-alert">Admin access is not configured on this deployment.</div> : null}
      {params.error ? <div className="v14-admin-alert">The email or password was not accepted.</div> : null}
      <form action="/api/admin/login" method="post" className="v12-form">
        <label>Administrator email<input name="email" type="email" required autoComplete="username" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        <button className="v12-button v12-button--solid" type="submit" disabled={!configured}>Sign in ↗</button>
      </form>
    </div>
  );
}

export default function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return <main className="v12-shell v12-page">
    <section className="v12-page-hero"><div className="v12-container v12-page-hero__grid"><div><span className="v12-kicker">MIROR / V14 / ADMIN</span></div><div><h1 className="v12-display">Controlled access to content operations.</h1><p>Admin routes are separate from the public site and require a signed server session.</p></div></div></section>
    <section className="v12-section"><div className="v12-container">
      <Suspense fallback={<div>Loading form...</div>}>
        <LoginForm searchParams={searchParams} />
      </Suspense>
    </div></section>
  </main>;
}
