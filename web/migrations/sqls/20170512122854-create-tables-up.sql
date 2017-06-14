CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  uuid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  apns_key TEXT,
  created_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL
);

CREATE TABLE stocks (
  symbol VARCHAR(15) PRIMARY KEY,
  as_of TIMESTAMPTZ NOT NULL,
  price DECIMAL(19, 6) NOT NULL,
  percent_change DECIMAL(19, 6) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL
);

CREATE TYPE alerts_operator AS ENUM ('>', '<');

CREATE TABLE alerts (
  uuid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_uuid uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  stock_symbol VARCHAR(15) REFERENCES stocks ON DELETE CASCADE NOT NULL,
  operator alerts_operator NOT NULL,
  price DECIMAL(19, 6) NOT NULL,
  notes VARCHAR(1000),
  triggered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT(NOW()) NOT NULL
);
