from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_V12_ROUTES = [
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/about/people/page.tsx",
    "src/app/about/leadership/page.tsx",
    "src/app/capabilities/page.tsx",
    "src/app/engineering/page.tsx",
    "src/app/work/page.tsx",
    "src/app/quality-safety/page.tsx",
    "src/app/sustainability/page.tsx",
    "src/app/locations/page.tsx",
    "src/app/careers/page.tsx",
    "src/app/clients/page.tsx",
    "src/app/insights/page.tsx",
    "src/app/resources/page.tsx",
    "src/app/why-miror/page.tsx",
    "src/app/faq/page.tsx",
    "src/app/contact/page.tsx",
]

forbidden = [
    "turn474",
    "example.com",
    "cursive",
    "MirorV9PageFrame",
    "global-menu",
]

def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)

for relative in REQUIRED_V12_ROUTES:
    path = ROOT / relative
    if not path.exists():
        fail(f"Missing route: {relative}")
    text = path.read_text(encoding="utf-8")
    if "v12" not in text.lower() and relative != "src/app/about/page.tsx":
        fail(f"Route is not wired to V12: {relative}")
    for token in forbidden:
        if token in text:
            fail(f"Forbidden token {token!r} found in {relative}")

layout = (ROOT / "src/app/layout.tsx").read_text(encoding="utf-8")
if "SiteHeaderV12" not in layout or "CorporateFooter" not in layout:
    fail("Global layout is missing the V12 header/footer")
if "v12-royal-editorial.css" not in layout:
    fail("V12 editorial stylesheet is not globally imported")

css = (ROOT / "src/styles/v12-royal-editorial.css").read_text(encoding="utf-8")
if "--miror-serif" not in css or "--miror-sans" not in css:
    fail("Typography tokens are missing")
if re.search(r"font-family\s*:[^;]*cursive", css, re.I):
    fail("Cursive typography is present")

workflow = ROOT / ".github/workflows/production.yml"
if not workflow.exists():
    fail("Production GitHub Actions workflow is missing")

print(f"PASS: V13 production contract validated — {len(REQUIRED_V12_ROUTES)} V12 routes, global typography/header/footer, and CI workflow present.")
