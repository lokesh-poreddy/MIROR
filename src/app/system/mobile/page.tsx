import type { Metadata } from "next";
import MirorV10Mobile from "@/components/system/mobile";
import "@/styles/production.css";

export const metadata: Metadata = {
  title: "Mobile architecture | Miror Constructions",
  description: "Mobile-first layout, touch, media and fallback rules.",
  alternates: { canonical: "/system/mobile" },
};

export default function SystemMobilePage() {
  return (
    <main className="miror-v10-route-shell ">
      <header className="miror-v10-route-header">
        <div className="miror-v10-eyebrow">MIROR / V10 / 43</div>
        <h1>Mobile architecture</h1>
        <p>Mobile-first layout, touch, media and fallback rules.</p>
        <nav className="miror-v10-nav-row" aria-label="Page actions">
          <a className="miror-v10-button miror-v10-button-primary" href="/contact">Contact Miror ↗</a>
          <a className="miror-v10-button" href="/work">View our work</a>
        </nav>
      </header>
      <section className="miror-v10-route-content">
        <MirorV10Mobile />
      </section>
    </main>
  );
}
