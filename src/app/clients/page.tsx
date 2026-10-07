import type { Metadata } from "next";
import { MirorV9PageFrame } from "@/components/page-frame";
import V9ClientsPartners from "@/components/sections/clients-partners";
import { getV9Route } from "@/data/routes";
import "@/styles/routing.css";
import "@/styles/sections.css";

const ROUTE = getV9Route("/clients")!;

export const metadata: Metadata = {
  title: `${ROUTE.shortTitle} | Miror Constructions`,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
};

export default function ClientsPage() {
  return (
    <MirorV9PageFrame route={ROUTE}>
      <div className="miror-v9-route-module">
        <V9ClientsPartners />
      </div>
    </MirorV9PageFrame>
  );
}
