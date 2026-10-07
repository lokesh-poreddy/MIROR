export const MIROR_V10_ROUTE_MAP = {
  notFound: { route: "/404", file: "src/app/not-found.tsx", component: "MirorV10NotFound" },
  loading: { route: "/system/loading", file: "src/app/system/loading/page.tsx", component: "MirorV10Loading" },
  accessibility: { route: "/accessibility", file: "src/app/accessibility/page.tsx", component: "MirorV10Accessibility" },
  performance: { route: "/system/performance", file: "src/app/system/performance/page.tsx", component: "MirorV10Performance" },
  mobile: { route: "/system/mobile", file: "src/app/system/mobile/page.tsx", component: "MirorV10Mobile" },
  privacy: { route: "/privacy", file: "src/app/privacy/page.tsx", component: "MirorV10LegalTrust" },
  terms: { route: "/terms", file: "src/app/terms/page.tsx", component: "MirorV10LegalTrust" },
  disclaimer: { route: "/disclaimer", file: "src/app/disclaimer/page.tsx", component: "MirorV10LegalTrust" },
  admin: { route: "/admin", file: "src/app/admin/page.tsx", component: "MirorV10Admin" },
  evidence: { route: "/admin/evidence", file: "src/app/admin/evidence/page.tsx", component: "MirorV10Evidence" },
  media: { route: "/admin/media", file: "src/app/admin/media/page.tsx", component: "MirorV10MediaRights" },
} as const;

export type MirorV10RouteKey = keyof typeof MIROR_V10_ROUTE_MAP;

export function v10RouteFor(key: MirorV10RouteKey) {
  return MIROR_V10_ROUTE_MAP[key].route;
}
