/* Replace with your SQL commands */

ALTER TABLE users ADD COLUMN password VARCHAR(512); 
ALTER TABLE users DROP COLUMN anon_uuid;
