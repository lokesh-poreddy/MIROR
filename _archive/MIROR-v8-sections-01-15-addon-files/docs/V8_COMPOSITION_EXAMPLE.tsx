"use client";

import { MirorV8Hero } from "@/components/v8/MirorV8Hero";
import { MirorV8Capabilities } from "@/components/v8/MirorV8Capabilities";
import { MirorV8EngineeringShowcase } from "@/components/v8/MirorV8EngineeringShowcase";

export default function MirorV8SectionsPreview(){
  return <main>
    <MirorV8Hero />
    <MirorV8Capabilities />
    <MirorV8EngineeringShowcase />
  </main>;
}
