import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Miror Constructions & Consultancy",
    template: "%s | Miror",
  },
  description:
    "Miror Constructions & Consultancy — civil construction, infrastructure and project execution.",
  metadataBase: new URL("https://example.com"),
  robots: { index: true, follow: true },
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
