import type { Metadata } from "next";
import { MirorV10Admin } from "@/components/v10/MirorV10Admin";
import "@/styles/miror-v10-production.css";

export const metadata: Metadata = {
  title: "Content Operations | Miror Constructions",
  description: "Protected administration foundation for website publishing.",
  alternates: { canonical: "/admin" },
};

export default function AdminPage() {
  return (
    <main className="miror-v10-route-shell technical">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 45</div>
        <h1>Content Operations</h1>
        <p>Protected administration foundation for website publishing.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10Admin />
      </section>
    </main>
  );
}
