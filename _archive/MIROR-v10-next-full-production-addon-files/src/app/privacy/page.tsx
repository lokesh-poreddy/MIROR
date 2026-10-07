import type { Metadata } from "next";
import { MirorV10LegalTrust } from "@/components/v10/MirorV10LegalTrust";
import "@/styles/miror-v10-production.css";

export const metadata: Metadata = {
  title: "Privacy | Miror Constructions",
  description: "Privacy framework awaiting final company-approved legal language.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="miror-v10-route-shell ">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 44</div>
        <h1>Privacy</h1>
        <p>Privacy framework awaiting final company-approved legal language.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10LegalTrust />
      </section>
    </main>
  );
}
