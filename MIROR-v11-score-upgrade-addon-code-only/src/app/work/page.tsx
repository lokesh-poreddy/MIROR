import Link from "next/link";
import { ProjectEvidenceBoard } from "@/components/upgrades/ProjectEvidenceBoard";

export const metadata = { title: "Our Work" };

export default function WorkPage() {
  return (
    <main className="miror-upgrade-home miror-upgrade-work-route">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">WORK / 01</div>
        <div>
          <span className="miror-upgrade-kicker">Our Work</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            Project stories built around what can be documented.
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>
            The portfolio distinguishes current public evidence from the additional client project set that is waiting for approved details and media. That keeps the site expandable without turning placeholders into claims.
          </p>
          <div className="miror-upgrade-actions">
            <Link href="/contact" className="miror-upgrade-button miror-upgrade-button--dark">Discuss a project <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <ProjectEvidenceBoard />
    </main>
  );
}
