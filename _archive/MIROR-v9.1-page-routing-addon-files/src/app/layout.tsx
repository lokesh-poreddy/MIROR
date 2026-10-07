import type { ReactNode } from "react";
import "@/styles/miror-v9-routing.css";

export default function CorporateRouteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-miror="corporate-v9"
      data-navigation="full-screen-menu"
      data-layout="editorial-12-column"
      data-responsive="desktop-tablet-mobile"
    >
      {children}
    </div>
  );
}
