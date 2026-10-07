import dynamic from "next/dynamic";

const MirorCadShowcase = dynamic(() => import("@/components/cad/MirorCadShowcase"), { ssr: false });

export default function CadDemoPage() {
  return (
    <main style={{ background: "#081015", minHeight: "100vh", color: "#f3f0e8" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "8vw 4vw" }}>
        <MirorCadShowcase
          projectTitle="Miror Structural Visualization"
          projectCategory="Construction & Infrastructure"
          projectLocation="India"
        />
      </div>
    </main>
  );
}
