/* Replace with your SQL commands */

ALTER TABLE users ADD COLUMN anon_uuid uuid UNIQUE; 
ALTER TABLE users DROP COLUMN password; 