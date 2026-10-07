import type { Metadata } from "next";
import MirorV10Evidence from "@/components/admin/evidence-panel";
import "@/styles/production.css";

export const metadata: Metadata = {
  title: "Project Evidence | Miror Constructions",
  description: "Evidence review and publication-gate operations.",
  alternates: { canonical: "/admin/evidence" },
};

export default function AdminEvidencePage() {
  return (
    <main className="miror-v10-route-shell technical">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 46</div>
        <h1>Project Evidence</h1>
        <p>Evidence review and publication-gate operations.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10Evidence />
      </section>
    </main>
  );
}
