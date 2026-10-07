export type PublicationState = "draft" | "review" | "approved" | "verified";

const riskyPatterns: RegExp[] = [
  /\bbest\s+in\s+class\b/i,
  /\bnumber\s*1\b/i,
  /\bmarket\s+leader\b/i,
  /\baward[-\s]?winning\b/i,
  /\bzero\s+accidents?\b/i,
  /\b100%\s+safe\b/i,
  /\bcarbon\s*neutral\b/i,
  /\bnet[-\s]?zero\b/i,
  /\biso\s*\d{3,6}\b/i,
  /\bcertified\s+by\b/i,
  /\b\d{2,4}\+\s+projects?\b/i,
  /\bturnover\s+of\b/i,
  /\bemployees?\s+of\b/i,
  /\brevenue\s+of\b/i,
];

export function normalizeContent(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ");
}

export function containsUnsupportedClaim(input: string): boolean {
  return riskyPatterns.some((pattern) => pattern.test(input));
}

export function canPublish(input: string, state: PublicationState): boolean {
  const value = normalizeContent(input);
  return Boolean(value) && (state === "approved" || state === "verified") && !containsUnsupportedClaim(value);
}

export function publicationLabel(state: PublicationState): string {
  switch (state) {
    case "verified":
      return "Verified evidence";
    case "approved":
      return "Approved for publication";
    case "review":
      return "Under review";
    default:
      return "Draft";
  }
}

export function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
  if (!origin) return true;
  return allowed.includes(origin);
}

export function safeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function safePhone(value: string): boolean {
  if (!value.trim()) return true;
  return /^[+()\d\s-]{7,22}$/.test(value.trim());
}

export function withinLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

export function escapePlainText(value: string): string {
  return value.replace(/[<>]/g, "");
}
