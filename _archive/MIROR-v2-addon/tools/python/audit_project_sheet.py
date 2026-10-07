#!/usr/bin/env python3
"""Audit project JSON/CSV staging data before it is imported into the MIROR site."""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REQUIRED = ("title", "category", "role", "status")


def load(path: Path):
    if path.suffix.lower() == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError("JSON must contain an array of projects")
        return data
    with path.open("r", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def audit(rows):
    issues = []
    for idx, row in enumerate(rows, start=1):
        for key in REQUIRED:
            if not str(row.get(key, "")).strip():
                issues.append(f"row {idx}: missing {key}")
        status = str(row.get("status", "")).strip()
        if status == "client-supplied-pending" and str(row.get("permission_to_publish", "")).lower() not in {"true", "yes", "1"}:
            issues.append(f"row {idx}: client-supplied project needs permission_to_publish=true")
        if status == "verified-public" and not str(row.get("source_document", "")).strip():
            issues.append(f"row {idx}: verified-public project needs source_document")
    return issues


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: audit_project_sheet.py projects.json|projects.csv")
        return 2
    path = Path(sys.argv[1])
    rows = load(path)
    issues = audit(rows)
    print(f"Records checked: {len(rows)}")
    if issues:
        print("AUDIT FAILED")
        print("\n".join(f"- {issue}" for issue in issues))
        return 1
    print("AUDIT PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
