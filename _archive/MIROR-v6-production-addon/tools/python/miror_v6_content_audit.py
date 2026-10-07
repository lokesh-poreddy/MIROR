#!/usr/bin/env python3
"""MIROR V6 project content QA pipeline.
Reads JSON/CSV project intake data, validates publication readiness,
checks claim-risk fields, and emits a deterministic audit report.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterable

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
URL_RE = re.compile(r"^https?://", re.I)
RISK_TERMS = ("crore", "million", "award", "award-winning", "certified", "government", "no.", "100+", "top", "largest", "best")
REQUIRED = ("slug", "title", "category", "location", "country", "summary", "miror_role", "scope", "publication_permission", "media_rights_cleared")

@dataclass
class Finding:
    severity: str
    code: str
    field: str
    message: str

@dataclass
class ProjectAudit:
    slug: str
    findings: list[Finding]
    publishable: bool

@dataclass
class AuditReport:
    source: str
    generated_at: str
    projects: list[ProjectAudit]
    summary: dict[str,int]


def clean(value: Any, limit: int = 5000) -> str:
    if value is None:
        return ""
    text = str(value).replace("\x00", " ")
    text = " ".join(text.split())
    return text[:limit].strip()


def boolish(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    return clean(value).lower() in {"true", "1", "yes", "y"}


def load_json(path: Path) -> list[dict[str, Any]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict) and isinstance(raw.get("projects"), list):
        raw = raw["projects"]
    if not isinstance(raw, list):
        raise ValueError("JSON root must be an array or an object containing projects")
    return [item for item in raw if isinstance(item, dict)]


def load_csv(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [dict(row) for row in csv.DictReader(handle)]


def load_records(path: Path) -> list[dict[str, Any]]:
    if path.suffix.lower() == ".json":
        return load_json(path)
    if path.suffix.lower() == ".csv":
        return load_csv(path)
    raise ValueError("Supported formats: .json, .csv")


def parse_scope(value: Any) -> list[str]:
    if isinstance(value, list):
        return [clean(item, 180) for item in value if clean(item,180)]
    return [clean(part,180) for part in clean(value,3000).split("|") if clean(part,180)]


def parse_evidence(value: Any) -> list[dict[str,Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item,dict)]
    text = clean(value,5000)
    if not text:
        return []
    return [{"state":"pending","source_label":"intake text","notes":text}]


def detect_risk_terms(record: dict[str,Any]) -> list[str]:
    blob = " ".join(clean(record.get(key),5000).lower() for key in ("title","summary","project_value","client","principal_contractor","miror_role","notes"))
    return sorted({term for term in RISK_TERMS if term in blob})


def validate_slug(slug: str) -> Finding | None:
    if not slug:
        return Finding("error","REQ_SLUG","slug","Slug is required")
    if not SLUG_RE.match(slug):
        return Finding("error","BAD_SLUG","slug","Slug must use lowercase kebab-case")
    return None


def validate_required(record: dict[str,Any]) -> list[Finding]:
    findings=[]
    for field in REQUIRED:
        value=record.get(field)
        if field=="scope":
            if not parse_scope(value): findings.append(Finding("error","REQ_SCOPE",field,"Scope must contain at least one item"))
        elif field.endswith("permission") or field.endswith("cleared"):
            if not boolish(value): findings.append(Finding("warning","APPROVAL_MISSING",field,"Explicit publication approval is required"))
        elif not clean(value):
            findings.append(Finding("error","REQ_FIELD",field,"Required field is missing"))
    return findings


def validate_email(field: str, value: Any) -> Finding | None:
    if not clean(value): return None
    if not EMAIL_RE.match(clean(value)):
        return Finding("error","BAD_EMAIL",field,"Email format is invalid")
    return None


def validate_urls(record: dict[str,Any]) -> list[Finding]:
    findings=[]
    for field in ("source_url","video_url","cover_image"):
        value=clean(record.get(field))
        if value and not URL_RE.match(value): findings.append(Finding("warning","RELATIVE_URL",field,"URL should be absolute for public ingestion"))
    return findings


def validate_evidence(record: dict[str,Any]) -> list[Finding]:
    findings=[]
    evidence=parse_evidence(record.get("evidence"))
    if not evidence:
        findings.append(Finding("warning","NO_EVIDENCE","evidence","No source evidence record provided"))
    if not any(clean(item.get("state")).lower()=="verified" for item in evidence):
        findings.append(Finding("warning","NOT_VERIFIED","evidence","At least one verified source is required for publication"))
    for index,item in enumerate(evidence):
        if clean(item.get("state")).lower()=="verified" and not (clean(item.get("source_url")) or clean(item.get("source_document")) or clean(item.get("source_label"))):
            findings.append(Finding("error","VERIFIED_NO_SOURCE",f"evidence[{index}]","Verified evidence must identify its source"))
    return findings


def validate_media(record: dict[str,Any]) -> list[Finding]:
    findings=[]
    media=record.get("gallery") or record.get("media") or []
    if isinstance(media,str): media=[part for part in media.split("|") if part]
    if not media: findings.append(Finding("warning","NO_MEDIA","gallery","No project media supplied"))
    if not boolish(record.get("media_rights_cleared")): findings.append(Finding("warning","MEDIA_RIGHTS","media_rights_cleared","Media rights must be approved before publication"))
    return findings


def validate_claims(record: dict[str,Any]) -> list[Finding]:
    findings=[]
    risks=detect_risk_terms(record)
    for term in risks:
        severity="warning" if term in {"award","award-winning","certified","government","crore","million"} else "info"
        findings.append(Finding(severity,"CLAIM_REVIEW", "copy", f"Marketing claim term '{term}' needs documentary review"))
    return findings


def audit_record(record: dict[str,Any]) -> ProjectAudit:
    slug=clean(record.get("slug"),160)
    findings=[]
    slug_finding=validate_slug(slug)
    if slug_finding: findings.append(slug_finding)
    findings.extend(validate_required(record))
    findings.extend(validate_urls(record))
    findings.extend(validate_evidence(record))
    findings.extend(validate_media(record))
    findings.extend(validate_claims(record))
    title=clean(record.get("title"),240)
    if title and len(title)<4: findings.append(Finding("warning","SHORT_TITLE","title","Project title is unusually short"))
    if len(clean(record.get("summary"),1500))<60: findings.append(Finding("warning","SHORT_SUMMARY","summary","Project summary may be too short for a case-study page"))
    errors=sum(1 for f in findings if f.severity=="error")
    warnings=sum(1 for f in findings if f.severity=="warning")
    publishable=errors==0 and warnings==0 and boolish(record.get("publication_permission")) and boolish(record.get("media_rights_cleared"))
    return ProjectAudit(slug=slug,findings=findings,publishable=publishable)


def build_report(source: Path, records: list[dict[str,Any]]) -> AuditReport:
    audits=[audit_record(record) for record in records]
    counts={"projects":len(audits),"publishable":sum(1 for a in audits if a.publishable),"errors":sum(1 for a in audits for f in a.findings if f.severity=="error"),"warnings":sum(1 for a in audits for f in a.findings if f.severity=="warning")}
    from datetime import datetime, timezone
    return AuditReport(source=str(source),generated_at=datetime.now(timezone.utc).isoformat(),projects=audits,summary=counts)


def write_report(report: AuditReport, output: Path) -> None:
    payload=asdict(report)
    output.write_text(json.dumps(payload,indent=2,ensure_ascii=False),encoding="utf-8")


def print_report(report: AuditReport) -> None:
    print(f"MIROR V6 content audit: {report.source}")
    print(json.dumps(report.summary,indent=2))
    for project in report.projects:
        status="PUBLISHABLE" if project.publishable else "REVIEW"
        print(f"\n[{status}] {project.slug}")
        for finding in project.findings:
            print(f"  {finding.severity.upper():7} {finding.code:20} {finding.field:20} {finding.message}")


def stable_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main(argv: Iterable[str] | None = None) -> int:
    parser=argparse.ArgumentParser()
    parser.add_argument("source",type=Path)
    parser.add_argument("--output",type=Path,default=Path("miror-v6-audit.json"))
    args=parser.parse_args(list(argv) if argv is not None else None)
    records=load_records(args.source)
    report=build_report(args.source,records)
    write_report(report,args.output)
    print_report(report)
    print(f"\nsource_sha256={stable_hash(args.source)}")
    return 0 if report.summary["errors"]==0 else 2

if __name__=="__main__":
    raise SystemExit(main())

def field_rule_001(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_001", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_002(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_002", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_003(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_003", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_004(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_004", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_005(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_005", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_006(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_006", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_007(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_007", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_008(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_008", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_009(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_009", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_010(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_010", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_011(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_011", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_012(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_012", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_013(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_013", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_014(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_014", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_015(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_015", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_016(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_016", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_017(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_017", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_018(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_018", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_019(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_019", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_020(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_020", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_021(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_021", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_022(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_022", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_023(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_023", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_024(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_024", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_025(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_025", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_026(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_026", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_027(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_027", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_028(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_028", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_029(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_029", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_030(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_030", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_031(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_031", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_032(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_032", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_033(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_033", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_034(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_034", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_035(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_035", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_036(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_036", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_037(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_037", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_038(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_038", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_039(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_039", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_040(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_040", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_041(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_041", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_042(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_042", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_043(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_043", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_044(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_044", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_045(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_045", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_046(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_046", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_047(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_047", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_048(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_048", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_049(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_049", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_050(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_050", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_051(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_051", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_052(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_052", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_053(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_053", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_054(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_054", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_055(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_055", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_056(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_056", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_057(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_057", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_058(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_058", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_059(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_059", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_060(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_060", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_061(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_061", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_062(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_062", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_063(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_063", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_064(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_064", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_065(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_065", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_066(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_066", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_067(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_067", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_068(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_068", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_069(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_069", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_070(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_070", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_071(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_071", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_072(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_072", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_073(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_073", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_074(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_074", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_075(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_075", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_076(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_076", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_077(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_077", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_078(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_078", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_079(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_079", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_080(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_080", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_081(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_081", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_082(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_082", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_083(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_083", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_084(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_084", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_085(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_085", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_086(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_086", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_087(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_087", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_088(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_088", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_089(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_089", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_090(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_090", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_091(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_091", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_092(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_092", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_093(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_093", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_094(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_094", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_095(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_095", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_096(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_096", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_097(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_097", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_098(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_098", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_099(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_099", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_100(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_100", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_101(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_101", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_102(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_102", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_103(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_103", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_104(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_104", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_105(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_105", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_106(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_106", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_107(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_107", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_108(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_108", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_109(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_109", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_110(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_110", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_111(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_111", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_112(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_112", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_113(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_113", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_114(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_114", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_115(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_115", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_116(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_116", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_117(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_117", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_118(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_118", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_119(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_119", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_120(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_120", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_121(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_121", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_122(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_122", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_123(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_123", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_124(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_124", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_125(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_125", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_126(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_126", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_127(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_127", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_128(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_128", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_129(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_129", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_130(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_130", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_131(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_131", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_132(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_132", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_133(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_133", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_134(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_134", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_135(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_135", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_136(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_136", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_137(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_137", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_138(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_138", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_139(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_139", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_140(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_140", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_141(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_141", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_142(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_142", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_143(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_143", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_144(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_144", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_145(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_145", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_146(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_146", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_147(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_147", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_148(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_148", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_149(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_149", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_150(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_150", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_151(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_151", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_152(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_152", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_153(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_153", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_154(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_154", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_155(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_155", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_156(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_156", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_157(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_157", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_158(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_158", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_159(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_159", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_160(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_160", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_161(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_161", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_162(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_162", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_163(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_163", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_164(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_164", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_165(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_165", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_166(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_166", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_167(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_167", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_168(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_168", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_169(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 120:
        return Finding("warning", "FIELD_LENGTH_169", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_170(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 140:
        return Finding("warning", "FIELD_LENGTH_170", "slug", "Field is longer than the preferred editorial budget")
    return None

def field_rule_171(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("title"), 900)
    if value and len(value) > 160:
        return Finding("warning", "FIELD_LENGTH_171", "title", "Field is longer than the preferred editorial budget")
    return None

def field_rule_172(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("category"), 900)
    if value and len(value) > 180:
        return Finding("warning", "FIELD_LENGTH_172", "category", "Field is longer than the preferred editorial budget")
    return None

def field_rule_173(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("location"), 900)
    if value and len(value) > 200:
        return Finding("warning", "FIELD_LENGTH_173", "location", "Field is longer than the preferred editorial budget")
    return None

def field_rule_174(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("country"), 900)
    if value and len(value) > 220:
        return Finding("warning", "FIELD_LENGTH_174", "country", "Field is longer than the preferred editorial budget")
    return None

def field_rule_175(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("summary"), 900)
    if value and len(value) > 240:
        return Finding("warning", "FIELD_LENGTH_175", "summary", "Field is longer than the preferred editorial budget")
    return None

def field_rule_176(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("miror_role"), 900)
    if value and len(value) > 260:
        return Finding("warning", "FIELD_LENGTH_176", "miror_role", "Field is longer than the preferred editorial budget")
    return None

def field_rule_177(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("scope"), 900)
    if value and len(value) > 280:
        return Finding("warning", "FIELD_LENGTH_177", "scope", "Field is longer than the preferred editorial budget")
    return None

def field_rule_178(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("publication_permission"), 900)
    if value and len(value) > 300:
        return Finding("warning", "FIELD_LENGTH_178", "publication_permission", "Field is longer than the preferred editorial budget")
    return None

def field_rule_179(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("media_rights_cleared"), 900)
    if value and len(value) > 320:
        return Finding("warning", "FIELD_LENGTH_179", "media_rights_cleared", "Field is longer than the preferred editorial budget")
    return None

def field_rule_180(record: dict[str, Any]) -> Finding | None:
    value = clean(record.get("slug"), 900)
    if value and len(value) > 100:
        return Finding("warning", "FIELD_LENGTH_180", "slug", "Field is longer than the preferred editorial budget")
    return None

def extended_field_findings(record: dict[str, Any]) -> list[Finding]:
    findings: list[Finding] = []
    functions = [globals()[f"field_rule_{i:03d}"] for i in range(1, 181)]
    for function in functions:
        result = function(record)
        if result is not None:
            findings.append(result)
    return findings
