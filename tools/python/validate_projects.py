"""Validate a client-supplied projects JSON file before website import.

Usage:
  python tools/python/validate_projects.py projects.json

The validator deliberately rejects likely fabrication/omission patterns such as missing
publication permission, missing title/location/scope, or project values without a source.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED = {"project_name", "category", "location", "scope_summary", "permission_to_publish"}


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python validate_projects.py projects.json")
        return 2
    path = Path(sys.argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        print("ERROR: top-level JSON must be an array")
        return 1
    failures = 0
    for index, project in enumerate(data, start=1):
        missing = sorted(REQUIRED - project.keys())
        if missing:
            print(f"[{index}] missing: {', '.join(missing)}")
            failures += 1
        if project.get("project_value") and not project.get("source_document"):
            print(f"[{index}] project_value requires source_document")
            failures += 1
        if project.get("permission_to_publish") is not True:
            print(f"[{index}] publication permission is not confirmed")
            failures += 1
    print(f"Validated {len(data)} project records; failures={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
