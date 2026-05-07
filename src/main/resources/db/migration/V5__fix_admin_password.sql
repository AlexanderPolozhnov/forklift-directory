-- Fix admin password hash (password: admin123, bcrypt strength 10)
UPDATE app_users
SET password = '$2a$10$PWpQLPFkQ0A5b3hCX0gYyeo0lyrt0gSHLgIdr6D9vorwRKygEjvEm'
WHERE username = 'admin';
