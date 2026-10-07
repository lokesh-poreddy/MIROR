import type { Metadata } from "next";
import { MirorV9PageFrame } from "@/components/page-frame";
import V9Locations from "@/components/sections/locations";
import { getV9Route } from "@/data/routes";
import "@/styles/routing.css";
import "@/styles/sections.css";

const ROUTE = getV9Route("/locations")!;

export const metadata: Metadata = {
  title: `${ROUTE.shortTitle} | Miror Constructions`,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
};

export default function LocationsPage() {
  return (
    <MirorV9PageFrame route={ROUTE}>
      <div className="miror-v9-route-module">
        <V9Locations />
      </div>
    </MirorV9PageFrame>
  );
}
