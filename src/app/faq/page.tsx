import type { Metadata } from "next";
import { MirorV9PageFrame } from "@/components/page-frame";
import V9Faq from "@/components/sections/faq";
import { getV9Route } from "@/data/routes";
import "@/styles/routing.css";
import "@/styles/sections.css";

const ROUTE = getV9Route("/faq")!;

export const metadata: Metadata = {
  title: `${ROUTE.shortTitle} | Miror Constructions`,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
};

export default function FaqPage() {
  return (
    <MirorV9PageFrame route={ROUTE}>
      <div className="miror-v9-route-module">
        <V9Faq />
      </div>
    </MirorV9PageFrame>
  );
}
