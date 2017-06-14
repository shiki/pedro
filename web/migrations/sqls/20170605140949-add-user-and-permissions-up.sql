/* Replace with your SQL commands */

DO $$
BEGIN
  IF NOT EXISTS(SELECT * FROM pg_catalog.pg_user WHERE usename = 'pedro_user') THEN
    CREATE USER pedro_user PASSWORD 'harvester_addicted_saddlebow_obeli_revaluate_birchen';
  END IF;
END
$$;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pedro_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO pedro_user;
-- GRANT CONNECT ON DATABASE pedro TO pedro_user;