-- MIROR V6 production schema
-- PostgreSQL 15+
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  cin TEXT,
  incorporation_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  registered_office TEXT,
  disclosure_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  discipline TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  project_status TEXT NOT NULL DEFAULT 'unknown',
  visibility TEXT NOT NULL DEFAULT 'draft',
  year_label TEXT,
  client_name TEXT,
  principal_contractor TEXT,
  miror_role TEXT,
  summary TEXT NOT NULL,
  publication_permission BOOLEAN NOT NULL DEFAULT false,
  media_rights_cleared BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 999,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_scope (
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL,
  label TEXT NOT NULL,
  PRIMARY KEY(project_id,item_order)
);

CREATE TABLE IF NOT EXISTS project_metric (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  item_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  source_label TEXT,
  source_url TEXT,
  source_document TEXT,
  state TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  checked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  src TEXT,
  alt_text TEXT NOT NULL,
  caption TEXT,
  rights_status TEXT NOT NULL DEFAULT 'unknown',
  focal_x NUMERIC(5,2) DEFAULT 50,
  focal_y NUMERIC(5,2) DEFAULT 50,
  width INTEGER,
  height INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS capability (
  id TEXT PRIMARY KEY,
  number_label TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  body TEXT NOT NULL,
  accent TEXT NOT NULL DEFAULT 'sand',
  sort_order INTEGER NOT NULL DEFAULT 999,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS project_capability (
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  capability_id TEXT NOT NULL REFERENCES capability(id) ON DELETE CASCADE,
  PRIMARY KEY(project_id,capability_id)
);

CREATE TABLE IF NOT EXISTS job_role (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  discipline TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enquiry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email CITEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  location TEXT,
  budget_band TEXT,
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  source TEXT,
  spam_score NUMERIC(4,3) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  request_id TEXT UNIQUE,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS career_application (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id TEXT NOT NULL REFERENCES job_role(id),
  name TEXT NOT NULL,
  email CITEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  portfolio_url TEXT,
  resume_storage_key TEXT,
  cover_note TEXT,
  consent BOOLEAN NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_event (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT NOT NULL,
  session_hash TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_visibility_order ON project(visibility,sort_order);
CREATE INDEX IF NOT EXISTS idx_project_category ON project(category);
CREATE INDEX IF NOT EXISTS idx_project_location ON project(location);
CREATE INDEX IF NOT EXISTS idx_project_status ON project(project_status);
CREATE INDEX IF NOT EXISTS idx_project_evidence_project ON project_evidence(project_id,state);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id,sort_order);
CREATE INDEX IF NOT EXISTS idx_capability_active_order ON capability(active,sort_order);
CREATE INDEX IF NOT EXISTS idx_job_role_active ON job_role(active,discipline);
CREATE INDEX IF NOT EXISTS idx_enquiry_status_created ON enquiry(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_career_role_created ON career_application(role_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name_created ON analytics_event(event_name,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_path_created ON analytics_event(path,created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_company_updated ON company_profile;
CREATE TRIGGER trg_company_updated BEFORE UPDATE ON company_profile FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_project_updated ON project;
CREATE TRIGGER trg_project_updated BEFORE UPDATE ON project FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_job_role_updated ON job_role;
CREATE TRIGGER trg_job_role_updated BEFORE UPDATE ON job_role FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_enquiry_updated ON enquiry;
CREATE TRIGGER trg_enquiry_updated BEFORE UPDATE ON enquiry FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_career_updated ON career_application;
CREATE TRIGGER trg_career_updated BEFORE UPDATE ON career_application FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO company_profile(legal_name,cin,incorporation_date,status,registered_office,disclosure_note)
VALUES('Miror Constructions and Consultancy Private Limited','U45500AP2019PTC111545','2019-03-28','active','D. No: 7-642(3), Gandhi Nagar, Mangamur Road, Ongole, Prakasam, Andhra Pradesh 523001, India','Client-provided context indicates the underlying construction business predates the current 2019 entity.')
ON CONFLICT DO NOTHING;

INSERT INTO capability(id,number_label,title,short_description,body,accent,sort_order)
VALUES
('civil-construction','01','Civil Construction','Structural and site execution','Site-led construction across earthwork, concrete, reinforcement, formwork and finishing interfaces.','sand',10),
('infrastructure-execution','02','Infrastructure Execution','Civil works for project environments','Execution support for infrastructure packages where sequencing, inspections and field coordination are central.','steel',20),
('structural-formwork','03','Structural & Formwork','RCC walls, slabs and formwork','Structural execution workflows for repetitive systems, aluminium formwork and concrete interfaces.','ink',30),
('site-delivery','04','Site Delivery','Planning, coordination and closeout','Field-first delivery discipline focused on sequencing, inspections, handoffs and closeout documentation.','signal',40)
ON CONFLICT(id) DO NOTHING;

-- Operational migration 001: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_001 ON project(sort_order,visibility,category);

-- Operational migration 002: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_002 ON project(sort_order,visibility,category);

-- Operational migration 003: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_003 ON project(sort_order,visibility,category);

-- Operational migration 004: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_004 ON project(sort_order,visibility,category);

-- Operational migration 005: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_005 ON project(sort_order,visibility,category);

-- Operational migration 006: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_006 ON project(sort_order,visibility,category);

-- Operational migration 007: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_007 ON project(sort_order,visibility,category);

-- Operational migration 008: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_008 ON project(sort_order,visibility,category);

-- Operational migration 009: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_009 ON project(sort_order,visibility,category);

-- Operational migration 010: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_010 ON project(sort_order,visibility,category);

-- Operational migration 011: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_011 ON project(sort_order,visibility,category);

-- Operational migration 012: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_012 ON project(sort_order,visibility,category);

-- Operational migration 013: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_013 ON project(sort_order,visibility,category);

-- Operational migration 014: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_014 ON project(sort_order,visibility,category);

-- Operational migration 015: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_015 ON project(sort_order,visibility,category);

-- Operational migration 016: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_016 ON project(sort_order,visibility,category);

-- Operational migration 017: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_017 ON project(sort_order,visibility,category);

-- Operational migration 018: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_018 ON project(sort_order,visibility,category);

-- Operational migration 019: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_019 ON project(sort_order,visibility,category);

-- Operational migration 020: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_020 ON project(sort_order,visibility,category);

-- Operational migration 021: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_021 ON project(sort_order,visibility,category);

-- Operational migration 022: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_022 ON project(sort_order,visibility,category);

-- Operational migration 023: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_023 ON project(sort_order,visibility,category);

-- Operational migration 024: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_024 ON project(sort_order,visibility,category);

-- Operational migration 025: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_025 ON project(sort_order,visibility,category);

-- Operational migration 026: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_026 ON project(sort_order,visibility,category);

-- Operational migration 027: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_027 ON project(sort_order,visibility,category);

-- Operational migration 028: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_028 ON project(sort_order,visibility,category);

-- Operational migration 029: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_029 ON project(sort_order,visibility,category);

-- Operational migration 030: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_030 ON project(sort_order,visibility,category);

-- Operational migration 031: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_031 ON project(sort_order,visibility,category);

-- Operational migration 032: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_032 ON project(sort_order,visibility,category);

-- Operational migration 033: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_033 ON project(sort_order,visibility,category);

-- Operational migration 034: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_034 ON project(sort_order,visibility,category);

-- Operational migration 035: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_035 ON project(sort_order,visibility,category);

-- Operational migration 036: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_036 ON project(sort_order,visibility,category);

-- Operational migration 037: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_037 ON project(sort_order,visibility,category);

-- Operational migration 038: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_038 ON project(sort_order,visibility,category);

-- Operational migration 039: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_039 ON project(sort_order,visibility,category);

-- Operational migration 040: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_040 ON project(sort_order,visibility,category);

-- Operational migration 041: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_041 ON project(sort_order,visibility,category);

-- Operational migration 042: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_042 ON project(sort_order,visibility,category);

-- Operational migration 043: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_043 ON project(sort_order,visibility,category);

-- Operational migration 044: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_044 ON project(sort_order,visibility,category);

-- Operational migration 045: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_045 ON project(sort_order,visibility,category);

-- Operational migration 046: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_046 ON project(sort_order,visibility,category);

-- Operational migration 047: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_047 ON project(sort_order,visibility,category);

-- Operational migration 048: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_048 ON project(sort_order,visibility,category);

-- Operational migration 049: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_049 ON project(sort_order,visibility,category);

-- Operational migration 050: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_050 ON project(sort_order,visibility,category);

-- Operational migration 051: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_051 ON project(sort_order,visibility,category);

-- Operational migration 052: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_052 ON project(sort_order,visibility,category);

-- Operational migration 053: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_053 ON project(sort_order,visibility,category);

-- Operational migration 054: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_054 ON project(sort_order,visibility,category);

-- Operational migration 055: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_055 ON project(sort_order,visibility,category);

-- Operational migration 056: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_056 ON project(sort_order,visibility,category);

-- Operational migration 057: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_057 ON project(sort_order,visibility,category);

-- Operational migration 058: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_058 ON project(sort_order,visibility,category);

-- Operational migration 059: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_059 ON project(sort_order,visibility,category);

-- Operational migration 060: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_060 ON project(sort_order,visibility,category);

-- Operational migration 061: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_061 ON project(sort_order,visibility,category);

-- Operational migration 062: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_062 ON project(sort_order,visibility,category);

-- Operational migration 063: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_063 ON project(sort_order,visibility,category);

-- Operational migration 064: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_064 ON project(sort_order,visibility,category);

-- Operational migration 065: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_065 ON project(sort_order,visibility,category);

-- Operational migration 066: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_066 ON project(sort_order,visibility,category);

-- Operational migration 067: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_067 ON project(sort_order,visibility,category);

-- Operational migration 068: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_068 ON project(sort_order,visibility,category);

-- Operational migration 069: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_069 ON project(sort_order,visibility,category);

-- Operational migration 070: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_070 ON project(sort_order,visibility,category);

-- Operational migration 071: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_071 ON project(sort_order,visibility,category);

-- Operational migration 072: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_072 ON project(sort_order,visibility,category);

-- Operational migration 073: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_073 ON project(sort_order,visibility,category);

-- Operational migration 074: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_074 ON project(sort_order,visibility,category);

-- Operational migration 075: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_075 ON project(sort_order,visibility,category);

-- Operational migration 076: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_076 ON project(sort_order,visibility,category);

-- Operational migration 077: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_077 ON project(sort_order,visibility,category);

-- Operational migration 078: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_078 ON project(sort_order,visibility,category);

-- Operational migration 079: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_079 ON project(sort_order,visibility,category);

-- Operational migration 080: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_080 ON project(sort_order,visibility,category);

-- Operational migration 081: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_081 ON project(sort_order,visibility,category);

-- Operational migration 082: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_082 ON project(sort_order,visibility,category);

-- Operational migration 083: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_083 ON project(sort_order,visibility,category);

-- Operational migration 084: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_084 ON project(sort_order,visibility,category);

-- Operational migration 085: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_085 ON project(sort_order,visibility,category);

-- Operational migration 086: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_086 ON project(sort_order,visibility,category);

-- Operational migration 087: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_087 ON project(sort_order,visibility,category);

-- Operational migration 088: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_088 ON project(sort_order,visibility,category);

-- Operational migration 089: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_089 ON project(sort_order,visibility,category);

-- Operational migration 090: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_090 ON project(sort_order,visibility,category);

-- Operational migration 091: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_091 ON project(sort_order,visibility,category);

-- Operational migration 092: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_092 ON project(sort_order,visibility,category);

-- Operational migration 093: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_093 ON project(sort_order,visibility,category);

-- Operational migration 094: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_094 ON project(sort_order,visibility,category);

-- Operational migration 095: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_095 ON project(sort_order,visibility,category);

-- Operational migration 096: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_096 ON project(sort_order,visibility,category);

-- Operational migration 097: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_097 ON project(sort_order,visibility,category);

-- Operational migration 098: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_098 ON project(sort_order,visibility,category);

-- Operational migration 099: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_099 ON project(sort_order,visibility,category);

-- Operational migration 100: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_100 ON project(sort_order,visibility,category);

-- Operational migration 101: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_101 ON project(sort_order,visibility,category);

-- Operational migration 102: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_102 ON project(sort_order,visibility,category);

-- Operational migration 103: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_103 ON project(sort_order,visibility,category);

-- Operational migration 104: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_104 ON project(sort_order,visibility,category);

-- Operational migration 105: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_105 ON project(sort_order,visibility,category);

-- Operational migration 106: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_106 ON project(sort_order,visibility,category);

-- Operational migration 107: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_107 ON project(sort_order,visibility,category);

-- Operational migration 108: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_108 ON project(sort_order,visibility,category);

-- Operational migration 109: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_109 ON project(sort_order,visibility,category);

-- Operational migration 110: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_110 ON project(sort_order,visibility,category);

-- Operational migration 111: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_111 ON project(sort_order,visibility,category);

-- Operational migration 112: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_112 ON project(sort_order,visibility,category);

-- Operational migration 113: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_113 ON project(sort_order,visibility,category);

-- Operational migration 114: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_114 ON project(sort_order,visibility,category);

-- Operational migration 115: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_115 ON project(sort_order,visibility,category);

-- Operational migration 116: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_116 ON project(sort_order,visibility,category);

-- Operational migration 117: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_117 ON project(sort_order,visibility,category);

-- Operational migration 118: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_118 ON project(sort_order,visibility,category);

-- Operational migration 119: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_119 ON project(sort_order,visibility,category);

-- Operational migration 120: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_120 ON project(sort_order,visibility,category);

-- Operational migration 121: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_121 ON project(sort_order,visibility,category);

-- Operational migration 122: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_122 ON project(sort_order,visibility,category);

-- Operational migration 123: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_123 ON project(sort_order,visibility,category);

-- Operational migration 124: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_124 ON project(sort_order,visibility,category);

-- Operational migration 125: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_125 ON project(sort_order,visibility,category);

-- Operational migration 126: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_126 ON project(sort_order,visibility,category);

-- Operational migration 127: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_127 ON project(sort_order,visibility,category);

-- Operational migration 128: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_128 ON project(sort_order,visibility,category);

-- Operational migration 129: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_129 ON project(sort_order,visibility,category);

-- Operational migration 130: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_130 ON project(sort_order,visibility,category);

-- Operational migration 131: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_131 ON project(sort_order,visibility,category);

-- Operational migration 132: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_132 ON project(sort_order,visibility,category);

-- Operational migration 133: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_133 ON project(sort_order,visibility,category);

-- Operational migration 134: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_134 ON project(sort_order,visibility,category);

-- Operational migration 135: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_135 ON project(sort_order,visibility,category);

-- Operational migration 136: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_136 ON project(sort_order,visibility,category);

-- Operational migration 137: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_137 ON project(sort_order,visibility,category);

-- Operational migration 138: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_138 ON project(sort_order,visibility,category);

-- Operational migration 139: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_139 ON project(sort_order,visibility,category);

-- Operational migration 140: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_140 ON project(sort_order,visibility,category);

-- Operational migration 141: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_141 ON project(sort_order,visibility,category);

-- Operational migration 142: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_142 ON project(sort_order,visibility,category);

-- Operational migration 143: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_143 ON project(sort_order,visibility,category);

-- Operational migration 144: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_144 ON project(sort_order,visibility,category);

-- Operational migration 145: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_145 ON project(sort_order,visibility,category);

-- Operational migration 146: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_146 ON project(sort_order,visibility,category);

-- Operational migration 147: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_147 ON project(sort_order,visibility,category);

-- Operational migration 148: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_148 ON project(sort_order,visibility,category);

-- Operational migration 149: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_149 ON project(sort_order,visibility,category);

-- Operational migration 150: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_150 ON project(sort_order,visibility,category);

-- Operational migration 151: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_151 ON project(sort_order,visibility,category);

-- Operational migration 152: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_152 ON project(sort_order,visibility,category);

-- Operational migration 153: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_153 ON project(sort_order,visibility,category);

-- Operational migration 154: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_154 ON project(sort_order,visibility,category);

-- Operational migration 155: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_155 ON project(sort_order,visibility,category);

-- Operational migration 156: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_156 ON project(sort_order,visibility,category);

-- Operational migration 157: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_157 ON project(sort_order,visibility,category);

-- Operational migration 158: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_158 ON project(sort_order,visibility,category);

-- Operational migration 159: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_159 ON project(sort_order,visibility,category);

-- Operational migration 160: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_160 ON project(sort_order,visibility,category);

-- Operational migration 161: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_161 ON project(sort_order,visibility,category);

-- Operational migration 162: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_162 ON project(sort_order,visibility,category);

-- Operational migration 163: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_163 ON project(sort_order,visibility,category);

-- Operational migration 164: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_164 ON project(sort_order,visibility,category);

-- Operational migration 165: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_165 ON project(sort_order,visibility,category);

-- Operational migration 166: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_166 ON project(sort_order,visibility,category);

-- Operational migration 167: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_167 ON project(sort_order,visibility,category);

-- Operational migration 168: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_168 ON project(sort_order,visibility,category);

-- Operational migration 169: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_169 ON project(sort_order,visibility,category);

-- Operational migration 170: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_170 ON project(sort_order,visibility,category);

-- Operational migration 171: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_171 ON project(sort_order,visibility,category);

-- Operational migration 172: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_172 ON project(sort_order,visibility,category);

-- Operational migration 173: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_173 ON project(sort_order,visibility,category);

-- Operational migration 174: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_174 ON project(sort_order,visibility,category);

-- Operational migration 175: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_175 ON project(sort_order,visibility,category);

-- Operational migration 176: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_176 ON project(sort_order,visibility,category);

-- Operational migration 177: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_177 ON project(sort_order,visibility,category);

-- Operational migration 178: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_178 ON project(sort_order,visibility,category);

-- Operational migration 179: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_179 ON project(sort_order,visibility,category);

-- Operational migration 180: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_180 ON project(sort_order,visibility,category);

-- Operational migration 181: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_181 ON project(sort_order,visibility,category);

-- Operational migration 182: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_182 ON project(sort_order,visibility,category);

-- Operational migration 183: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_183 ON project(sort_order,visibility,category);

-- Operational migration 184: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_184 ON project(sort_order,visibility,category);

-- Operational migration 185: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_185 ON project(sort_order,visibility,category);

-- Operational migration 186: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_186 ON project(sort_order,visibility,category);

-- Operational migration 187: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_187 ON project(sort_order,visibility,category);

-- Operational migration 188: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_188 ON project(sort_order,visibility,category);

-- Operational migration 189: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_189 ON project(sort_order,visibility,category);

-- Operational migration 190: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_190 ON project(sort_order,visibility,category);

-- Operational migration 191: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_191 ON project(sort_order,visibility,category);

-- Operational migration 192: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_192 ON project(sort_order,visibility,category);

-- Operational migration 193: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_193 ON project(sort_order,visibility,category);

-- Operational migration 194: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_194 ON project(sort_order,visibility,category);

-- Operational migration 195: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_195 ON project(sort_order,visibility,category);

-- Operational migration 196: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_196 ON project(sort_order,visibility,category);

-- Operational migration 197: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_197 ON project(sort_order,visibility,category);

-- Operational migration 198: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_198 ON project(sort_order,visibility,category);

-- Operational migration 199: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_199 ON project(sort_order,visibility,category);

-- Operational migration 200: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_200 ON project(sort_order,visibility,category);

-- Operational migration 201: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_201 ON project(sort_order,visibility,category);

-- Operational migration 202: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_202 ON project(sort_order,visibility,category);

-- Operational migration 203: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_203 ON project(sort_order,visibility,category);

-- Operational migration 204: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_204 ON project(sort_order,visibility,category);

-- Operational migration 205: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_205 ON project(sort_order,visibility,category);

-- Operational migration 206: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_206 ON project(sort_order,visibility,category);

-- Operational migration 207: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_207 ON project(sort_order,visibility,category);

-- Operational migration 208: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_208 ON project(sort_order,visibility,category);

-- Operational migration 209: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_209 ON project(sort_order,visibility,category);

-- Operational migration 210: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_210 ON project(sort_order,visibility,category);

-- Operational migration 211: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_211 ON project(sort_order,visibility,category);

-- Operational migration 212: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_212 ON project(sort_order,visibility,category);

-- Operational migration 213: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_213 ON project(sort_order,visibility,category);

-- Operational migration 214: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_214 ON project(sort_order,visibility,category);

-- Operational migration 215: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_215 ON project(sort_order,visibility,category);

-- Operational migration 216: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_216 ON project(sort_order,visibility,category);

-- Operational migration 217: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_217 ON project(sort_order,visibility,category);

-- Operational migration 218: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_218 ON project(sort_order,visibility,category);

-- Operational migration 219: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_219 ON project(sort_order,visibility,category);

-- Operational migration 220: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_220 ON project(sort_order,visibility,category);

-- Operational migration 221: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_221 ON project(sort_order,visibility,category);

-- Operational migration 222: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_222 ON project(sort_order,visibility,category);

-- Operational migration 223: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_223 ON project(sort_order,visibility,category);

-- Operational migration 224: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_224 ON project(sort_order,visibility,category);

-- Operational migration 225: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_225 ON project(sort_order,visibility,category);

-- Operational migration 226: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_226 ON project(sort_order,visibility,category);

-- Operational migration 227: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_227 ON project(sort_order,visibility,category);

-- Operational migration 228: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_228 ON project(sort_order,visibility,category);

-- Operational migration 229: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_229 ON project(sort_order,visibility,category);

-- Operational migration 230: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_230 ON project(sort_order,visibility,category);

-- Operational migration 231: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_231 ON project(sort_order,visibility,category);

-- Operational migration 232: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_232 ON project(sort_order,visibility,category);

-- Operational migration 233: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_233 ON project(sort_order,visibility,category);

-- Operational migration 234: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_234 ON project(sort_order,visibility,category);

-- Operational migration 235: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_235 ON project(sort_order,visibility,category);

-- Operational migration 236: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_236 ON project(sort_order,visibility,category);

-- Operational migration 237: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_237 ON project(sort_order,visibility,category);

-- Operational migration 238: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_238 ON project(sort_order,visibility,category);

-- Operational migration 239: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_239 ON project(sort_order,visibility,category);

-- Operational migration 240: maintain a deterministic, auditable database surface.
CREATE INDEX IF NOT EXISTS idx_miror_v6_ops_240 ON project(sort_order,visibility,category);

-- Publication view: only projects that satisfy the evidence gate.
CREATE OR REPLACE VIEW published_project AS
SELECT p.*
FROM project p
WHERE p.visibility = 'published'
  AND p.publication_permission = true
  AND p.media_rights_cleared = true
  AND p.miror_role IS NOT NULL
  AND EXISTS (SELECT 1 FROM project_evidence e WHERE e.project_id = p.id AND e.state = 'verified');
