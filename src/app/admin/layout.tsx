import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";



export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin-login");

  return <div className="v14-admin-shell">
    <div className="v14-admin-bar">
      <div><span className="v12-kicker">MIROR / V14 / CONTENT OPERATIONS</span><strong>Admin console</strong></div>
      <nav aria-label="Admin navigation"><Link href="/admin">Overview</Link><Link href="/admin/evidence">Evidence</Link><Link href="/admin/media">Media</Link></nav>
      <div className="v14-admin-account"><span>{session.email}</span><form action="/api/admin/logout" method="post"><button type="submit">Sign out</button></form></div>
    </div>
    <div className="v14-admin-content">{children}</div>
  </div>;
}
