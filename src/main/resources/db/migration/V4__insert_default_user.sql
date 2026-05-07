CREATE SCHEMA IF NOT EXISTS forklift;
SET search_path TO forklift;

-- Password: admin123 (bcrypt, strength 10)
INSERT INTO app_users (username, password, full_name)
VALUES ('admin', '$2a$10$PkqkA1RV2q3LB0MnB1DkZeicHEFdxALXvhWkdTg1aJ4b0NrMf9Ihe', 'Администратор');
