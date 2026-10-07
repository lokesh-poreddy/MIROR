from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "next.config.ts",
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/app/about/page.tsx",
    "src/app/capabilities/page.tsx",
    "src/app/capabilities/[slug]/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/engineering/page.tsx",
    "src/app/work/page.tsx",
    "src/app/work/[slug]/page.tsx",
    "src/app/api/enquiries/route.ts",
    "src/components/site-header.tsx",
    "src/components/upgrades/EngineeringBlueprint.tsx",
    "src/components/upgrades/MirorHomeUpgrade.tsx",
    "src/components/upgrades/ProjectEvidenceBoard.tsx",
    "src/data/miror-upgrade.ts",
    "src/lib/content-governance.ts",
    "src/styles/miror-score-upgrade.css",
]

errors = []
for rel in REQUIRED:
    if not (ROOT / rel).exists():
        errors.append(f"missing:{rel}")

page = (ROOT / "src/app/page.tsx").read_text() if (ROOT / "src/app/page.tsx").exists() else ""
layout = (ROOT / "src/app/layout.tsx").read_text() if (ROOT / "src/app/layout.tsx").exists() else ""
header = (ROOT / "src/components/site-header.tsx").read_text() if (ROOT / "src/components/site-header.tsx").exists() else ""
data = (ROOT / "src/data/miror-upgrade.ts").read_text() if (ROOT / "src/data/miror-upgrade.ts").exists() else ""
css = (ROOT / "src/styles/miror-score-upgrade.css").read_text() if (ROOT / "src/styles/miror-score-upgrade.css").exists() else ""
api = (ROOT / "src/app/api/enquiries/route.ts").read_text() if (ROOT / "src/app/api/enquiries/route.ts").exists() else ""

checks = {
    "homepage-mounted": "MirorHomeUpgrade" in page,
    "upgrade-css-mounted": "miror-score-upgrade.css" in layout,
    "header-upgrade-mounted": "miror-upgrade-header" in header,
    "single-project-source": 'from "@/data/projects"' in data and "baseProjects.map" in data,
    "no-example-domain": "example.com" not in layout and "example.com" not in page,
    "no-web-citation-markers": "turn474" not in data and "turn474" not in page,
    "api-rate-limit": "RATE_LIMIT_MAX" in api and "429" in api,
    "api-honeypot": 'form.get("website")' in api,
    "css-balanced": css.count("{") == css.count("}"),
    "css-parens-balanced": css.count("(") == css.count(")"),
    "capability-dynamic-route": (ROOT / "src/app/capabilities/[slug]/page.tsx").exists(),
    "work-dynamic-route": (ROOT / "src/app/work/[slug]/page.tsx").exists(),
}

for name, ok in checks.items():
    if not ok:
        errors.append(f"check-failed:{name}")

if errors:
    print("FAIL")
    for item in errors:
        print(item)
    raise SystemExit(1)

print(f"PASS: {len(REQUIRED)} required files present; {len(checks)} contract checks passed")
