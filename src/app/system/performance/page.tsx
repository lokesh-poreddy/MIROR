import type { Metadata } from "next";
import MirorV10Performance from "@/components/system/performance";
import "@/styles/production.css";

export const metadata: Metadata = {
  title: "Performance | Miror Constructions",
  description: "Device-aware visual quality, runtime and media budgets.",
  alternates: { canonical: "/system/performance" },
};

export default function SystemPerformancePage() {
  return (
    <main className="miror-v10-route-shell technical">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 42</div>
        <h1>Performance</h1>
        <p>Device-aware visual quality, runtime and media budgets.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10Performance />
      </section>
    </main>
  );
}
