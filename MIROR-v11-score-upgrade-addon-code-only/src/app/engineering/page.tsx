import { EngineeringBlueprint } from "@/components/upgrades/EngineeringBlueprint";

export const metadata = { title: "Engineering" };

const disciplines = [
  ["CAD-ready", "The visual system is designed to accept approved AutoCAD, Civil 3D, Revit, IFC or GLB-derived assets later."],
  ["Web-native", "Critical technical context is rendered without forcing visitors to download raw project files."],
  ["Evidence-aware", "Conceptual diagrams are clearly separated from verified project deliverables."],
  ["Progressive", "The same engineering language can scale from hero graphics to project case-study diagrams."],
] as const;

export default function EngineeringPage() {
  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">ENGINEERING / 01</div>
        <div>
          <span className="miror-upgrade-kicker">Engineering visual language</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            Draw the engineering story before the model becomes the story.
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>
            This route establishes a technical communication layer for Miror: plan, elevation, section and 3D views that feel like engineering documents instead of generic 3D decoration.
          </p>
        </div>
      </section>
      <EngineeringBlueprint />
      <section className="miror-upgrade-capabilities">
        <div className="miror-upgrade-section-head"><div><span className="miror-upgrade-kicker">Engineering system / 02</span><h2>Designed for real technical assets later.</h2></div></div>
        <div className="miror-upgrade-process__grid">
          {disciplines.map(([title, body], index) => <article key={title} className="miror-upgrade-step"><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>
    </main>
  );
}
