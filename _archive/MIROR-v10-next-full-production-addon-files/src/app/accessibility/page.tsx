import type { Metadata } from "next";
import { MirorV10Accessibility } from "@/components/v10/MirorV10Accessibility";
import "@/styles/miror-v10-production.css";

export const metadata: Metadata = {
  title: "Accessibility | Miror Constructions",
  description: "Motion, keyboard, contrast and focus controls.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="miror-v10-route-shell ">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 41</div>
        <h1>Accessibility</h1>
        <p>Motion, keyboard, contrast and focus controls.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10Accessibility />
      </section>
    </main>
  );
}
