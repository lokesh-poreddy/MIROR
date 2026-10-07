import MirorV10Loading from "@/components/system/loading-screen";
import "@/styles/production.css";

export default function Loading() {
  return (
    <main className="miror-v10-route-shell technical" aria-busy="true">
      <MirorV10Loading />
    </main>
  );
}
