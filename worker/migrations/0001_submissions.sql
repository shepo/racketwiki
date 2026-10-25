CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('correction', 'listing', 'sponsor')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payload TEXT NOT NULL,
  email TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  reviewed_at TEXT,
  sanity_id TEXT
);
CREATE INDEX IF NOT EXISTS submissions_status ON submissions (status, created_at);
CREATE INDEX IF NOT EXISTS submissions_ip ON submissions (ip_hash, created_at);
