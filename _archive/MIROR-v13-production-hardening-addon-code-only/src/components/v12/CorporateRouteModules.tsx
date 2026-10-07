import Link from "next/link";

type Card = { number: string; title: string; body: string };

type RouteProps = {
  eyebrow: string;
  title: string;
  lead: string;
  cards: Card[];
  dark?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

function RouteHeader({ eyebrow, title, lead }: Pick<RouteProps, "eyebrow" | "title" | "lead">) {
  return (
    <section className="v12-page-hero">
      <div className="v12-container v12-page-hero__grid">
        <div><span className="v12-kicker">{eyebrow}</span></div>
        <div>
          <h1 className="v12-display">{title}</h1>
          <p>{lead}</p>
        </div>
      </div>
    </section>
  );
}

function CardGrid({ cards, dark = false }: { cards: Card[]; dark?: boolean }) {
  return (
    <div className={dark ? "v12-dark-grid" : "v12-data-grid"}>
      {cards.map((card) => (
        <article className={dark ? "v12-dark-card" : "v12-data-card"} key={card.number}>
          <span className={dark ? undefined : "v12-data-card__number"}>{card.number}</span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </article>
      ))}
    </div>
  );
}

function RoutePage({ eyebrow, title, lead, cards, dark, ctaLabel = "Contact Miror ↗", ctaHref = "/contact" }: RouteProps) {
  return (
    <main className="v12-shell v12-page">
      <RouteHeader eyebrow={eyebrow} title={title} lead={lead} />
      <section className={`v12-section${dark ? " v12-section--dark" : ""}`}>
        <div className="v12-container">
          <CardGrid cards={cards} dark={Boolean(dark)} />
          <div className="v12-route-actions">
            <Link className={dark ? "v12-button v12-button--light" : "v12-button v12-button--solid"} href={ctaHref}>{ctaLabel}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export function PeoplePage() {
  return (
    <RoutePage
      eyebrow="People / 01"
      title="People who turn drawings into working structures."
      lead="The public people story focuses on the functions that carry projects from engineering intent to site execution. Names, biographies and photographs are added only after company approval."
      cards={[
        { number: "01", title: "Project engineering", body: "Engineering coordination, drawing interpretation and project-facing technical decisions." },
        { number: "02", title: "Site execution", body: "Field teams that translate scope, sequence and site conditions into physical work." },
        { number: "03", title: "Planning", body: "Practical planning around activities, interfaces, materials and delivery dependencies." },
        { number: "04", title: "Quality & safety", body: "Functions that keep inspections, controls, observations and corrective action visible." },
        { number: "05", title: "Commercial", body: "Commercial coordination and project communication prepared for confirmed company information." },
        { number: "06", title: "Administration", body: "The operational support that keeps project and corporate workflows connected." },
      ]}
      ctaLabel="Explore careers ↗"
      ctaHref="/careers"
    />
  );
}

export function LeadershipPage() {
  return (
    <RoutePage
      eyebrow="Leadership / 01"
      title="Leadership, experience and the discipline behind delivery."
      lead="Leadership profiles are structured for publication without inventing names, titles, credentials or biographies before company review."
      cards={[
        { number: "01", title: "Leadership profiles", body: "A dedicated presentation for approved leadership names, responsibilities, experience and photographs." },
        { number: "02", title: "Experience", body: "Project and construction experience can be connected to leadership profiles once the company confirms the record." },
        { number: "03", title: "Decision discipline", body: "A clear link between project requirements, engineering judgement, site decisions and delivery responsibility." },
        { number: "04", title: "Corporate continuity", body: "The leadership narrative can distinguish the current private limited entity from the broader business history." },
        { number: "05", title: "Future profile updates", body: "The page is ready for approved biographies, portraits, milestones and company statements." },
        { number: "06", title: "Contact", body: "Project, partnership and corporate enquiries remain available while profile content is being prepared." },
      ]}
      ctaLabel="About Miror ↗"
      ctaHref="/about"
    />
  );
}

export function ClientsPartnersPage() {
  return (
    <RoutePage
      eyebrow="Clients & Partners / 01"
      title="Built through trusted project relationships."
      lead="This page is intentionally permission-aware: confirmed relationship records can be published with the correct project context, while logos and names remain hidden until approved."
      cards={[
        { number: "01", title: "Confirmed relationships", body: "Project relationships can be presented alongside the exact Miror role and scope supported by available evidence." },
        { number: "02", title: "Principal contractors", body: "A structured area for confirmed package-level relationships without attributing larger programmes beyond Miror's documented scope." },
        { number: "03", title: "Developers", body: "A future-ready space for approved residential and development relationships." },
        { number: "04", title: "Infrastructure partners", body: "Infrastructure project relationships can be added with package, region and role context." },
        { number: "05", title: "Technology & material partners", body: "Partner categories can be added when company-approved project or technology information is available." },
        { number: "06", title: "Publication control", body: "Every logo, name and testimonial should have an explicit approval state before publication." },
      ]}
      ctaLabel="Discuss a partnership ↗"
      ctaHref="mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Partnership%20Enquiry"
    />
  );
}

export function SustainabilityPage() {
  return (
    <RoutePage
      eyebrow="Sustainability / 01"
      title="Responsible construction, considered from the ground up."
      lead="A useful sustainability story can begin with site stewardship, resource awareness, efficient planning and practical controls without making unsupported environmental claims."
      cards={[
        { number: "01", title: "Site stewardship", body: "Keep work areas, materials, access routes and site conditions part of the execution conversation." },
        { number: "02", title: "Resource discipline", body: "Structure future content around material awareness, planning efficiency and responsible use of project resources." },
        { number: "03", title: "Construction waste", body: "A future evidence area for approved methods covering segregation, reuse or disposal practices." },
        { number: "04", title: "Water & energy", body: "Approved project examples can document practical measures when company records are available." },
        { number: "05", title: "Future methods", body: "The page is prepared for verified innovations, construction methods and technology adoption." },
        { number: "06", title: "Evidence first", body: "Formal targets, certifications and quantified environmental claims remain publication-controlled." },
      ]}
      ctaLabel="Discuss responsible construction ↗"
    />
  );
}

export function InsightsPage() {
  return (
    <RoutePage
      eyebrow="Insights / 01"
      title="Learning new methods. Improving the work."
      lead="Insights should be useful to clients and project teams: practical field learning, engineering thinking, construction methods and lessons that can be supported by real company experience."
      cards={[
        { number: "01", title: "Engineering thinking", body: "Explain how technical decisions, drawings and execution constraints interact on real work." },
        { number: "02", title: "Field learning", body: "Turn confirmed site observations into concise, useful lessons without exposing confidential project information." },
        { number: "03", title: "Construction methods", body: "Future articles can cover formwork, concrete execution, sequencing and other approved topics." },
        { number: "04", title: "Project evidence", body: "Use project records to explain context and scope rather than publishing generic thought-leadership claims." },
        { number: "05", title: "Technology", body: "Approved digital, BIM, CAD and site technologies can be introduced here as they become part of the company story." },
        { number: "06", title: "Learning archive", body: "The structure is ready for dated articles, technical notes, project updates and controlled downloads." },
      ]}
      ctaLabel="Explore engineering ↗"
      ctaHref="/engineering"
    />
  );
}

export function ResourcesPage() {
  return (
    <RoutePage
      eyebrow="Resources / 01"
      title="The documents behind the work."
      lead="A controlled resource center for company information, project sheets, capability statements, policies and approved technical documentation."
      cards={[
        { number: "01", title: "Company profile", body: "A downloadable company profile can be published here after final corporate approval." },
        { number: "02", title: "Capability statements", body: "Dedicated capability sheets can provide concise scope, applications and contact context." },
        { number: "03", title: "Project sheets", body: "Approved project records can become compact downloadable case-study documents." },
        { number: "04", title: "Policies", body: "Future approved quality, safety, environmental or corporate policies can be listed here." },
        { number: "05", title: "Technical documents", body: "Controlled technical material should be presented with version, date and publication status." },
        { number: "06", title: "Document request", body: "Visitors can request a document directly when it is not appropriate to publish it publicly." },
      ]}
      ctaLabel="Request a document ↗"
      ctaHref="mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Document%20Request"
    />
  );
}
