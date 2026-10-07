import type { Metadata } from "next";
import MirorV10MediaRights from "@/components/admin/media-rights";
import "@/styles/production.css";

export const metadata: Metadata = {
  title: "Media Rights | Miror Constructions",
  description: "Ownership, approval and usage-right operations.",
  alternates: { canonical: "/admin/media" },
};

export default function AdminMediaPage() {
  return (
    <main className="miror-v10-route-shell technical">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 47</div>
        <h1>Media Rights</h1>
        <p>Ownership, approval and usage-right operations.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10MediaRights />
      </section>
    </main>
  );
}
