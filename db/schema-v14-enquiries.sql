-- MIROR V14 additive migration for the existing PostgreSQL / Supabase enquiries table.
-- Safe for the current V13 schema: it adds V14 fields instead of replacing the table.

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS enquiry_type TEXT;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS notification_status TEXT;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS notification_id TEXT;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ;

UPDATE enquiries
SET enquiry_type = 'General enquiry'
WHERE enquiry_type IS NULL;

UPDATE enquiries
SET notification_status = 'not_configured'
WHERE notification_status IS NULL;

ALTER TABLE enquiries
  ALTER COLUMN enquiry_type SET DEFAULT 'General enquiry',
  ALTER COLUMN enquiry_type SET NOT NULL;

ALTER TABLE enquiries
  ALTER COLUMN notification_status SET DEFAULT 'pending',
  ALTER COLUMN notification_status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'enquiries_notification_status_check'
      AND conrelid = 'enquiries'::regclass
  ) THEN
    ALTER TABLE enquiries
      ADD CONSTRAINT enquiries_notification_status_check
      CHECK (notification_status IN ('pending','sent','failed','not_configured'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
  ON enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS enquiries_notification_status_idx
  ON enquiries (notification_status);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE enquiries FROM anon;
REVOKE ALL ON TABLE enquiries FROM authenticated;
