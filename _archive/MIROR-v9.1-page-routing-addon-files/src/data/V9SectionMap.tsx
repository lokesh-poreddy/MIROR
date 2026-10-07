import React from "react";
import V9Sustainability from "@/components/v9/MirorV9Sustainability";
import V9People from "@/components/v9/MirorV9People";
import V9Leadership from "@/components/v9/MirorV9Leadership";
import V9Careers from "@/components/v9/MirorV9Careers";
import V9ClientsPartners from "@/components/v9/MirorV9ClientsPartners";
import V9Locations from "@/components/v9/MirorV9Locations";
import V9Insights from "@/components/v9/MirorV9Insights";
import V9Resources from "@/components/v9/MirorV9Resources";
import V9WhyMiror from "@/components/v9/MirorV9WhyMiror";
import V9Faq from "@/components/v9/MirorV9Faq";
import V9Contact from "@/components/v9/MirorV9Contact";
import V9SmartContact from "@/components/v9/MirorV9SmartContact";

export type V9RouteKey =
  | "/sustainability"
  | "/about/people"
  | "/about/leadership"
  | "/careers"
  | "/clients"
  | "/locations"
  | "/insights"
  | "/resources"
  | "/why-miror"
  | "/faq"
  | "/contact";

type SectionComponent = React.ComponentType;

const ROUTE_COMPONENTS: Record<V9RouteKey, SectionComponent[]> = {
  "/sustainability": [V9Sustainability],
  "/about/people": [V9People],
  "/about/leadership": [V9Leadership],
  "/careers": [V9Careers],
  "/clients": [V9ClientsPartners],
  "/locations": [V9Locations],
  "/insights": [V9Insights],
  "/resources": [V9Resources],
  "/why-miror": [V9WhyMiror],
  "/faq": [V9Faq],
  "/contact": [V9Contact, V9SmartContact],
};

export function V9RouteSections({ route }: { route: V9RouteKey }) {
  const sections = ROUTE_COMPONENTS[route];
  return (
    <div className="miror-v9-route-sections">
      {sections.map((Section, index) => (
        <React.Fragment key={`${route}-${index}`}>
          <Section />
          {index < sections.length - 1 ? <div className="miror-v9-route-divider" aria-hidden="true" /> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export function getMappedComponents(route: V9RouteKey): SectionComponent[] {
  return ROUTE_COMPONENTS[route] ?? [];
}

export const V9_ROUTE_COMPONENT_SUMMARY = Object.fromEntries(
  Object.entries(ROUTE_COMPONENTS).map(([route, components]) => [
    route,
    components.map((component) => component.displayName || component.name || "anonymous"),
  ]),
);
