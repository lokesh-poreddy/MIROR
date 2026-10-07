import Link from "next/link";
import { listEnquiries, isPersistenceConfigured } from "@/lib/supabase-rest";
import { isEmailNotificationConfigured } from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Overview", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const persistence = isPersistenceConfigured();
  const notifications = isEmailNotificationConfigured();
  const enquiries = persistence ? await listEnquiries(25).catch(() => []) : [];
  return <main className="v14-admin-overview">
    <div className="v14-admin-heading"><div><span className="v12-kicker">Operations / 01</span><h1 className="v12-display">Controlled content and enquiry operations.</h1></div><div className="v14-admin-actions"><Link className="v12-button" href="/admin/evidence">Evidence review ↗</Link><Link className="v12-button" href="/admin/media">Media rights ↗</Link></div></div>
    <section className="v14-admin-metrics" aria-label="Operational status"><article><span>Persistence</span><strong>{persistence ? "Connected" : "Not configured"}</strong><small>Supabase-backed enquiry store</small></article><article><span>Notifications</span><strong>{notifications ? "Connected" : "Not configured"}</strong><small>Resend delivery</small></article><article><span>Latest enquiries</span><strong>{enquiries.length}</strong><small>Latest 25 records</small></article></section>
    <section className="v14-admin-table"><div className="v14-admin-table-head"><span className="v12-kicker">Latest enquiries</span><h2>Recent conversations captured by the public site.</h2></div>{!persistence ? <div className="v14-admin-alert">Configure <code>SUPABASE_URL</code> and <code>SUPABASE_SECRET_KEY</code> before production enquiries can be stored.</div> : enquiries.length === 0 ? <div className="v14-admin-empty">No enquiries have been recorded yet.</div> : <div className="v14-admin-enquiry-list">{enquiries.map((item) => <article key={item.id}><div><span className="v12-kicker">{item.enquiry_type}</span><h3>{item.name}</h3><p>{item.message}</p></div><dl><div><dt>Email</dt><dd>{item.email}</dd></div><div><dt>Company</dt><dd>{item.company_name || "—"}</dd></div><div><dt>Notification</dt><dd>{item.notification_status}</dd></div><div><dt>Created</dt><dd>{new Date(item.created_at).toLocaleString("en-IN")}</dd></div></dl></article>)}</div>}</section>
  </main>;
}
