from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "src/lib/site-config.ts", "src/lib/admin-session.ts", "src/lib/supabase-rest.ts", "src/lib/notifications.ts",
    "src/app/admin/layout.tsx", "src/app/admin-login/page.tsx", "src/app/api/admin/login/route.ts",
    "src/app/api/admin/logout/route.ts", "src/app/api/admin/enquiries/route.ts", "src/app/api/enquiries/route.ts",
    "src/app/sitemap.ts", "src/app/robots.ts", "src/data/project-media.ts", "src/components/v12/ProjectMedia.tsx", "src/components/v12/ProjectCaseStudies.tsx", "src/app/work/[slug]/page.tsx",
    "src/styles/v14-production.css", "db/schema-v14-enquiries.sql", ".env.example",
]
for p in REQUIRED:
    if not (ROOT / p).exists():
        print(f"FAIL: missing {p}"); sys.exit(1)

for p in ["src/app/sitemap.ts", "src/app/layout.tsx", "src/app/api/enquiries/route.ts"]:
    text = (ROOT / p).read_text(encoding="utf-8")
    for bad in ["mirorconstructions.example", "example.com", "placeholder.svg"]:
        if bad in text:
            print(f"FAIL: forbidden token {bad!r} in {p}"); sys.exit(1)

if "metadataBase" not in (ROOT / "src/app/layout.tsx").read_text():
    print("FAIL: metadataBase missing"); sys.exit(1)
if "siteOrigin" not in (ROOT / "src/app/sitemap.ts").read_text():
    print("FAIL: sitemap does not use site origin"); sys.exit(1)
if "/sitemap.xml" not in (ROOT / "src/app/robots.ts").read_text():
    print("FAIL: robots sitemap missing"); sys.exit(1)
if "getAdminSession" not in (ROOT / "src/app/admin/layout.tsx").read_text():
    print("FAIL: admin layout is not protected"); sys.exit(1)
if "insertEnquiry" not in (ROOT / "src/app/api/enquiries/route.ts").read_text():
    print("FAIL: enquiry persistence is missing"); sys.exit(1)
if "partialPrefetching: true" not in (ROOT / "next.config.ts").read_text():
    print("FAIL: partialPrefetching is not explicit"); sys.exit(1)
if "Content-Security-Policy" not in (ROOT / "next.config.ts").read_text():
    print("FAIL: CSP missing"); sys.exit(1)

print("PASS: V14 production hardening bundle is structurally complete.")
