-- Additive migration for the V2 experience system.
-- PostgreSQL. Do not run against production without migration tooling.

CREATE TABLE IF NOT EXISTS project_media (
    id BIGSERIAL PRIMARY KEY,
    project_slug TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('cover','gallery','video','blueprint','document')),
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_media_slug_order
    ON project_media (project_slug, sort_order);

CREATE TABLE IF NOT EXISTS enquiry_events (
    id BIGSERIAL PRIMARY KEY,
    enquiry_id BIGINT,
    event_type TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_events_type_created
    ON enquiry_events (event_type, created_at DESC);
