export type NavItem = {
  label: string;
  href: string;
  eyebrow: string;
  description: string;
};

export const navItems: NavItem[] = [
  { label: "About", href: "/about", eyebrow: "01", description: "Legacy, people and the way we work." },
  { label: "Capabilities", href: "/capabilities", eyebrow: "02", description: "Civil, structural and infrastructure execution." },
  { label: "Our Work", href: "/work", eyebrow: "03", description: "A growing archive of selected project work." },
  { label: "Quality & Safety", href: "/quality-safety", eyebrow: "04", description: "Disciplined site execution and quality culture." },
  { label: "Careers", href: "/careers", eyebrow: "05", description: "Build your next chapter with Miror." },
  { label: "Contact", href: "/contact", eyebrow: "06", description: "Talk about a project, package or partnership." },
];

export const footerGroups = [
  { title: "Company", items: navItems.slice(0, 3) },
  { title: "Trust", items: navItems.slice(3, 5) },
  { title: "Connect", items: [navItems[5]] },
] as const;
