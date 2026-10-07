import type { Metadata } from "next";
import { SiteHeaderV12 } from "@/components/site-header-v12";
import { CorporateFooter } from "@/components/v12/CorporateFooter";
import "./globals.css";
import "../styles/miror-score-upgrade.css";
import "../styles/v12-royal-editorial.css";

export const metadata: Metadata = {
  title: { default: "Miror Constructions & Consultancy", template: "%s | Miror" },
  description: "Miror Constructions & Consultancy — civil construction, infrastructure and engineering execution.",
  robots: { index: true, follow: true },
  applicationName: "Miror Constructions & Consultancy",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><SiteHeaderV12/>{children}<CorporateFooter/></body></html>;
}
