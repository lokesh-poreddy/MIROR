import type { Metadata } from "next";
import { SiteHeaderV12 } from "@/components/site-header-v12";
import { CorporateFooter } from "@/components/v12/CorporateFooter";
import { getSiteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";
import "../styles/miror-score-upgrade.css";
import "../styles/v12-royal-editorial.css";
import "../styles/v14-production.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: siteConfig.name, template: "%s | Miror" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.description, url: getSiteUrl() },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SiteHeaderV12 />{children}<CorporateFooter /></body></html>;
}
