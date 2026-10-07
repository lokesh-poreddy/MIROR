from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "src/app"
SKIP = {"api", "admin", "system"}
for path in sorted(ROOT.rglob("page.tsx")):
    parts = path.relative_to(ROOT).parts[:-1]
    if parts and parts[0] in SKIP:
        continue
    text = path.read_text(encoding="utf-8")
    route = "/" + "/".join(parts) if parts else "/"
    print(f"{route:28} {'V12' if 'v12' in text.lower() else 'LEGACY'}  {len(text.splitlines()):4} lines")
