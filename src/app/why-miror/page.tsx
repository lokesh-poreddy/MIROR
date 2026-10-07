import type { Metadata } from "next";
import { MirorV9PageFrame } from "@/components/page-frame";
import V9WhyMiror from "@/components/sections/why-miror";
import { getV9Route } from "@/data/routes";
import "@/styles/routing.css";
import "@/styles/sections.css";

const ROUTE = getV9Route("/why-miror")!;

export const metadata: Metadata = {
  title: `${ROUTE.shortTitle} | Miror Constructions`,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
};

export default function WhyMirorPage() {
  return (
    <MirorV9PageFrame route={ROUTE}>
      <div className="miror-v9-route-module">
        <V9WhyMiror />
      </div>
    </MirorV9PageFrame>
  );
}
