import type { MirorRouteConfig } from "@/components/page-frame";
import { MIROR_V9_ROUTES } from "@/data/routes";

export type V9NavigationGroup = {
  label: string;
  items: MirorRouteConfig[];
};

export const MIROR_V9_NAVIGATION_GROUPS: V9NavigationGroup[] = [
  { label: "About", items: MIROR_V9_ROUTES.filter((route: MirorRouteConfig) => route.menuGroup === "About") },
  { label: "Capabilities & Work", items: MIROR_V9_ROUTES.filter((route: MirorRouteConfig) => ["/sustainability","/locations","/insights"].includes(route.path)) },
  { label: "Company", items: MIROR_V9_ROUTES.filter((route: MirorRouteConfig) => route.menuGroup === "Company") },
  { label: "Support", items: MIROR_V9_ROUTES.filter((route: MirorRouteConfig) => route.menuGroup === "Support") },
  { label: "Contact", items: MIROR_V9_ROUTES.filter((route: MirorRouteConfig) => route.menuGroup === "Contact") },
];

export function findNavigationRoute(pathname: string) {
  return MIROR_V9_ROUTES.find((route: MirorRouteConfig) => route.path === pathname);
}
