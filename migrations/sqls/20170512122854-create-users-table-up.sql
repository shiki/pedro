
CREATE TABLE users (
  uuid uuid PRIMARY KEY,
  apns_key TEXT,
  created_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL
);