-- MIROR V10 production-system migration
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS miror_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS miror_admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES miror_admin_users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, permission)
);

CREATE TABLE IF NOT EXISTS miror_projects_v10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  role TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  description TEXT,
  public_visible BOOLEAN NOT NULL DEFAULT FALSE,
  approval_state TEXT NOT NULL DEFAULT 'draft',
  source_ref TEXT,
  publication_permission BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS miror_project_evidence_v10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES miror_projects_v10(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_ref TEXT,
  state TEXT NOT NULL DEFAULT 'missing',
  permission_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  reviewer_id UUID REFERENCES miror_admin_users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS miror_media_rights_v10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES miror_projects_v10(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  media_kind TEXT NOT NULL,
  source TEXT NOT NULL,
  owner TEXT NOT NULL,
  rights_state TEXT NOT NULL DEFAULT 'draft',
  approved_by UUID REFERENCES miror_admin_users(id),
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  alt_text TEXT,
  redacted BOOLEAN NOT NULL DEFAULT FALSE,
  storage_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS miror_release_checks_v10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_key TEXT NOT NULL UNIQUE,
  check_group TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  required BOOLEAN NOT NULL DEFAULT TRUE,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  message TEXT,
  checked_at TIMESTAMPTZ,
  checked_by UUID REFERENCES miror_admin_users(id)
);

CREATE INDEX IF NOT EXISTS miror_projects_v10_visibility_idx ON miror_projects_v10(public_visible, approval_state);
CREATE INDEX IF NOT EXISTS miror_projects_v10_location_idx ON miror_projects_v10(location);
CREATE INDEX IF NOT EXISTS miror_project_evidence_v10_project_idx ON miror_project_evidence_v10(project_id, state);
CREATE INDEX IF NOT EXISTS miror_media_rights_v10_project_idx ON miror_media_rights_v10(project_id, rights_state);
CREATE INDEX IF NOT EXISTS miror_release_checks_v10_group_idx ON miror_release_checks_v10(check_group, passed);

CREATE OR REPLACE FUNCTION miror_v10_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS miror_projects_v10_updated ON miror_projects_v10;
CREATE TRIGGER miror_projects_v10_updated BEFORE UPDATE ON miror_projects_v10 FOR EACH ROW EXECUTE FUNCTION miror_v10_updated_at();

DROP TRIGGER IF EXISTS miror_media_rights_v10_updated ON miror_media_rights_v10;
CREATE TRIGGER miror_media_rights_v10_updated BEFORE UPDATE ON miror_media_rights_v10 FOR EACH ROW EXECUTE FUNCTION miror_v10_updated_at();
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-001', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-002', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-003', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-004', 'admin', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-005', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-006', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-007', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-008', 'performance', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-009', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-010', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-011', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-012', 'evidence', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-013', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-014', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-015', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-016', 'mobile', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-017', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-018', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-019', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-020', 'media', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-021', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-022', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-023', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-024', 'legal', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-025', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-026', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-027', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-028', 'accessibility', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-029', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-030', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-031', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-032', 'admin', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-033', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-034', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-035', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-036', 'performance', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-037', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-038', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-039', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-040', 'evidence', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-041', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-042', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-043', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-044', 'mobile', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-045', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-046', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-047', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-048', 'media', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-049', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-050', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-051', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-052', 'legal', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-053', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-054', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-055', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-056', 'accessibility', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-057', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-058', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-059', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-060', 'admin', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-061', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-062', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-063', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-064', 'performance', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-065', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-066', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-067', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-068', 'evidence', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-069', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-070', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-071', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-072', 'mobile', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-073', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-074', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-075', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-076', 'media', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-077', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-078', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-079', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-080', 'legal', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-081', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-082', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-083', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-084', 'accessibility', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-085', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-086', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-087', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-088', 'admin', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-089', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-090', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-091', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-092', 'performance', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-093', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-094', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-095', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-096', 'evidence', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-097', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-098', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-099', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-100', 'mobile', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-101', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-102', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-103', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-104', 'media', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-105', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-106', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-107', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-108', 'legal', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-109', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-110', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-111', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-112', 'accessibility', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-113', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-114', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-115', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-116', 'admin', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-117', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-118', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-119', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-120', 'performance', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-121', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-122', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-123', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-124', 'evidence', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-125', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-126', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-127', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-128', 'mobile', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-129', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-130', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-131', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-132', 'media', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-133', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-134', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-135', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-136', 'legal', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-137', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-138', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-139', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-140', 'accessibility', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-141', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-142', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-143', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-144', 'admin', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-145', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-146', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-147', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-148', 'performance', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-149', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-150', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-151', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-152', 'evidence', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-153', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-154', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-155', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-156', 'mobile', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-157', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-158', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-159', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-160', 'media', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-161', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-162', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-163', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-164', 'legal', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-165', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-166', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-167', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-168', 'accessibility', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-169', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-170', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-171', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-172', 'admin', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-173', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-174', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-175', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-176', 'performance', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-177', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-178', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-179', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-180', 'evidence', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-181', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-182', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-183', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-184', 'mobile', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-185', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-186', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-187', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-188', 'media', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-189', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-190', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-191', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-192', 'legal', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-193', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-194', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-195', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-196', 'accessibility', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-197', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-198', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-199', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-200', 'admin', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-201', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-202', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-203', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-204', 'performance', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-205', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-206', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-207', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-208', 'evidence', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-209', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-210', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-211', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-212', 'mobile', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-213', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-214', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-215', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-216', 'media', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-217', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-218', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-219', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-220', 'legal', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-221', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-222', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-223', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-224', 'accessibility', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-225', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-226', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-227', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-228', 'admin', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-229', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-230', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-231', 'accessibility', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-232', 'performance', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-233', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-234', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-235', 'admin', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-236', 'evidence', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-237', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-238', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-239', 'performance', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-240', 'mobile', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-241', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-242', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-243', 'evidence', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-244', 'media', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-245', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-246', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-247', 'mobile', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-248', 'legal', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-249', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-250', 'evidence', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-251', 'media', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-252', 'accessibility', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-253', 'performance', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-254', 'mobile', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-255', 'legal', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-256', 'admin', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-257', 'evidence', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-258', 'media', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-259', 'accessibility', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-260', 'performance', 'high', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-261', 'mobile', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-262', 'legal', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-263', 'admin', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-evidence-264', 'evidence', 'low', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-media-265', 'media', 'medium', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-accessibility-266', 'accessibility', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-performance-267', 'performance', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-mobile-268', 'mobile', 'medium', FALSE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-legal-269', 'legal', 'high', TRUE) ON CONFLICT (check_key) DO NOTHING;
INSERT INTO miror_release_checks_v10 (check_key, check_group, severity, required) VALUES ('v10-admin-270', 'admin', 'low', TRUE) ON CONFLICT (check_key) DO NOTHING;

COMMIT;
