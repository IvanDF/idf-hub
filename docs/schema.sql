-- ============================================================
-- iDF Hub — Supabase schema
-- Safe to re-run: uses IF NOT EXISTS + DROP IF EXISTS for policies.
-- ============================================================

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  -- Three values, one axis: what kind of work it is. The old seven mixed in
  -- the platform, which `platform` below already records.
  category TEXT NOT NULL CHECK (category IN ('CODE','DESIGN','CRAFT')),
  -- Subcategory. Craft is the bucket that subdivides; the others leave it null.
  kind TEXT CHECK (kind IN ('photo','template','shortcut','experiment')),
  platform TEXT CHECK (platform IN ('github','figma','notion','codepen','apple-shortcuts','vscode-marketplace','web')),
  tags TEXT[] DEFAULT '{}',
  year TEXT NOT NULL,
  duration TEXT,
  role TEXT,
  status TEXT CHECK (status IN ('live','in-progress','archived','concept')),
  stack TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  problem TEXT,
  solution TEXT,
  metrics JSONB DEFAULT '[]',
  links JSONB DEFAULT '{}',
  media JSONB NOT NULL DEFAULT '{"thumbnail":""}',
  interaction TEXT CHECK (interaction IN ('glitch','tilt','spotlight')),
  layout TEXT CHECK (layout IN ('tall','wide','featured')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Migration: seven categories to three, plus the kind column ──────────────
-- The CREATE TABLE above only applies to a fresh database. These run on one
-- that already exists, and are safe to re-run.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS kind TEXT;

-- Fold the platform-flavoured categories into the axis that survived, and take
-- the distinction they carried down into `kind` where it still means something.
UPDATE projects SET kind = 'experiment' WHERE category IN ('CODEPEN','EXPERIMENT') AND kind IS NULL;
UPDATE projects SET kind = 'shortcut'   WHERE category = 'APPLE'  AND kind IS NULL;
UPDATE projects SET kind = 'template'   WHERE category = 'MAKER'  AND kind IS NULL;
UPDATE projects SET category = 'CODE'   WHERE category IN ('DEV','VSCODE');
-- CREATIVE held both printed graphics and photography, and nothing in the row
-- separates them. Everything lands in DESIGN here; photographic work has to be
-- moved to CRAFT / 'photo' by hand. src/data/projects.ts is the canonical copy
-- and already has it right.
UPDATE projects SET category = 'DESIGN' WHERE category = 'CREATIVE';
UPDATE projects SET category = 'CRAFT'  WHERE category IN ('MAKER','APPLE','CODEPEN','EXPERIMENT');

-- Constraints last: the rows have to be legal before the checks are enforced.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE projects ADD  CONSTRAINT projects_category_check
  CHECK (category IN ('CODE','DESIGN','CRAFT'));
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_kind_check;
ALTER TABLE projects ADD  CONSTRAINT projects_kind_check
  CHECK (kind IS NULL OR kind IN ('photo','template','shortcut','experiment'));

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read projects"           ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert"     ON projects;
DROP POLICY IF EXISTS "Authenticated users can update"     ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete"     ON projects;

CREATE POLICY "Public can read projects"       ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON projects FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── Snake leaderboard ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS snake_scores (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Anonymous',
  score INTEGER NOT NULL CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE snake_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read snake scores"  ON snake_scores;
DROP POLICY IF EXISTS "Anyone can insert snake scores" ON snake_scores;

CREATE POLICY "Public can read snake scores"   ON snake_scores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert snake scores" ON snake_scores FOR INSERT WITH CHECK (true);
