import type { Metadata } from "next";
import { MirorV10Loading } from "@/components/v10/MirorV10Loading";
import "@/styles/miror-v10-production.css";

export const metadata: Metadata = {
  title: "MIROR Loading System | Miror Constructions",
  description: "Short branded loading and route transition behavior.",
  alternates: { canonical: "/system/loading" },
};

export default function SystemLoadingPage() {
  return (
    <main className="miror-v10-route-shell technical">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 40</div>
        <h1>MIROR Loading System</h1>
        <p>Short branded loading and route transition behavior.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10Loading />
      </section>
    </main>
  );
}
