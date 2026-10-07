from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
required=[
"src/styles/v12-royal-editorial.css","src/components/site-header-v12.tsx","src/components/v12/EngineeringStudio.tsx",
"src/components/v12/ProjectCaseStudies.tsx","src/components/v12/CapabilityShowcase.tsx","src/components/v12/QualitySafetySystem.tsx",
"src/components/v12/PeopleCareers.tsx","src/components/v12/LocationsLedger.tsx","src/components/v12/RoyalHome.tsx",
"src/components/v12/CorporateFooter.tsx","src/app/layout.tsx","src/app/page.tsx","src/app/about/page.tsx",
"src/app/capabilities/page.tsx","src/app/capabilities/[slug]/page.tsx","src/app/engineering/page.tsx","src/app/work/page.tsx",
"src/app/work/[slug]/page.tsx","src/app/quality-safety/page.tsx","src/app/careers/page.tsx","src/app/locations/page.tsx",
"src/app/why-miror/page.tsx","src/app/faq/page.tsx","src/app/contact/page.tsx"]
errors=[]
for rel in required:
    p=ROOT/rel
    if not p.exists(): errors.append(f"missing: {rel}")
    elif p.stat().st_size < 120: errors.append(f"too small: {rel}")
text="\n".join((ROOT/p).read_text(encoding="utf-8") for p in required if (ROOT/p).exists())
for bad in ["cite", "turn474", "font-family.*cursive"]:
    if re.search(bad,text,re.I): errors.append(f"forbidden token/pattern: {bad}")
css=(ROOT/"src/styles/v12-royal-editorial.css").read_text(encoding="utf-8")
if "cursive" in css.lower(): errors.append("cursive typography detected")
if css.count("{") != css.count("}"): errors.append("CSS brace mismatch")
if errors:
    print("FAIL")
    print("\n".join(errors)); sys.exit(1)
print(f"PASS: {len(required)} required files validated; no citation artifacts; no cursive type; CSS balanced")
