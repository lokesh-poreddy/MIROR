import MirorV10Loading from "@/components/v10/MirorV10Loading";
import "@/styles/miror-v10-production.css";

export default function Loading() {
  return (
    <main className="miror-v10-route-shell technical" aria-busy="true">
      <MirorV10Loading />
    </main>
  );
}
