import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "../styles/miror-score-upgrade.css";

export const metadata: Metadata = {
  title: {
    default: "Miror Constructions & Consultancy",
    template: "%s | Miror",
  },
  description:
    "Miror Constructions & Consultancy — evidence-led civil construction, infrastructure and engineering execution.",
  robots: { index: true, follow: true },
  applicationName: "Miror Constructions & Consultancy",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
