import Link from "next/link";
import { MIROR_V9_ROUTES, V9_VALID_ROUTE_COUNT, V9_INVALID_ROUTE_COUNT } from "@/data/V9RouteRegistry";
import "@/styles/miror-v9-routing.css";

export const metadata = {
  title: "Corporate Route Hub | Miror Constructions",
  description: "Internal review hub for Miror's V9 corporate route architecture.",
};

export default function MirorCorporateHub() {
  return (
    <main className="miror-v9-page">
      <section className="miror-v9-page-hero">
        <div className="miror-v9-page-hero-inner">
          <div className="miror-v9-page-eyebrow">MIROR / V9.1 CORPORATE ROUTING HUB</div>
          <h1 className="miror-v9-page-title">Every corporate section has a route.</h1>
          <p className="miror-v9-page-lead">
            Review the exact Next.js paths, section mounts, page alignment and corporate information
            architecture before moving the application into production.
          </p>
          <div className="miror-v9-page-actions">
            <Link className="miror-v9-button miror-v9-button-primary" href="/contact">Start a conversation ↗</Link>
            <Link className="miror-v9-button" href="/work">View our work</Link>
          </div>
        </div>
      </section>
      <section className="miror-v9-section">
        <div className="miror-v9-container">
          <div className="miror-v9-topline">
            <span className="miror-v9-eyebrow">ROUTE MAP / V9.1</span>
            <span className="miror-v9-eyebrow">VALID {V9_VALID_ROUTE_COUNT} / INVALID {V9_INVALID_ROUTE_COUNT}</span>
          </div>
          <div className="miror-v9-grid" style={{ "--v9-columns": 2 } as React.CSSProperties}>
            {MIROR_V9_ROUTES.map((route) => (
              <article className="miror-v9-card" key={route.path}>
                <span className="miror-v9-card-number">{route.number}</span>
                <span className="miror-v9-card-meta">{route.path}</span>
                <h2 className="miror-v9-card-title">{route.shortTitle}</h2>
                <p className="miror-v9-muted">{route.description}</p>
                <div className="miror-v9-card-bottom">
                  <span className="miror-v9-status">{route.align} / {route.heroMode}</span>
                  <Link className="miror-v9-button" href={route.path}>Open page ↗</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
