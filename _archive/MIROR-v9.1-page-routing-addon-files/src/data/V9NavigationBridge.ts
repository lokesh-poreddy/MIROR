import type { MirorRouteConfig } from "@/components/v9/MirorV9PageFrame";
import { MIROR_V9_ROUTES } from "@/data/V9RouteRegistry";

export type V9NavigationGroup = {
  label: string;
  items: MirorRouteConfig[];
};

export const MIROR_V9_NAVIGATION_GROUPS: V9NavigationGroup[] = [
  { label: "About", items: MIROR_V9_ROUTES.filter(route => route.menuGroup === "About") },
  { label: "Capabilities & Work", items: MIROR_V9_ROUTES.filter(route => ["/sustainability","/locations","/insights"].includes(route.path)) },
  { label: "Company", items: MIROR_V9_ROUTES.filter(route => route.menuGroup === "Company") },
  { label: "Support", items: MIROR_V9_ROUTES.filter(route => route.menuGroup === "Support") },
  { label: "Contact", items: MIROR_V9_ROUTES.filter(route => route.menuGroup === "Contact") },
];

export function findNavigationRoute(pathname: string) {
  return MIROR_V9_ROUTES.find(route => route.path === pathname);
}
