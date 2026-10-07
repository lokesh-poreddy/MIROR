import type { Metadata } from "next";
import { MirorV9PageFrame } from "@/components/page-frame";
import V9Insights from "@/components/sections/insights";
import { getV9Route } from "@/data/routes";
import "@/styles/routing.css";
import "@/styles/sections.css";

const ROUTE = getV9Route("/insights")!;

export const metadata: Metadata = {
  title: `${ROUTE.shortTitle} | Miror Constructions`,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
};

export default function InsightsPage() {
  return (
    <MirorV9PageFrame route={ROUTE}>
      <div className="miror-v9-route-module">
        <V9Insights />
      </div>
    </MirorV9PageFrame>
  );
}
