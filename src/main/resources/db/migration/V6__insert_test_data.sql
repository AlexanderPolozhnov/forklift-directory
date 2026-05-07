CREATE SCHEMA IF NOT EXISTS forklift;
SET search_path TO forklift;

-- 10 forklifts
INSERT INTO forklifts (brand, number, load_capacity, is_active, modified_at, modified_by) VALUES
    ('Toyota',       'TYT-1001', 1.500, TRUE,  NOW(), 'system'),
    ('Toyota',       'TYT-1002', 2.000, TRUE,  NOW(), 'system'),
    ('Kion',         'KIO-2001', 1.750, TRUE,  NOW(), 'system'),
    ('Kion',         'KIO-2002', 3.200, FALSE, NOW(), 'system'),
    ('Hyster',       'HYS-3001', 2.500, TRUE,  NOW(), 'system'),
    ('Hyster',       'HYS-3002', 4.000, TRUE,  NOW(), 'system'),
    ('Crown',        'CRW-4001', 1.200, TRUE,  NOW(), 'system'),
    ('Crown',        'CRW-4002', 2.750, TRUE,  NOW(), 'system'),
    ('Jungheinrich', 'JUN-5001', 3.500, TRUE,  NOW(), 'system'),
    ('Jungheinrich', 'JUN-5002', 1.000, FALSE, NOW(), 'system');

-- 5 incidents spread across forklifts 1, 2, 3, 5, 7
-- forklifts 1, 2, 3 have incidents (satisfies >=2 forklifts with incidents for 409 on delete)
-- incident with resolved_at = NULL (active)
INSERT INTO incidents (forklift_id, started_at, resolved_at, description)
SELECT f.id, started_at, resolved_at, description
FROM (VALUES
    ('TYT-1001', TIMESTAMP '2024-01-10 08:30:00', TIMESTAMP '2024-01-10 12:00:00', 'Hydraulic leak detected and fixed'),
    ('TYT-1001', TIMESTAMP '2024-03-15 14:00:00', NULL,                            'Battery failure — under investigation'),
    ('TYT-1002', TIMESTAMP '2024-02-20 09:15:00', TIMESTAMP '2024-02-20 17:30:00', 'Mast chain replacement'),
    ('KIO-2001', TIMESTAMP '2024-04-05 11:00:00', TIMESTAMP '2024-04-06 10:00:00', 'Brake system overhaul'),
    ('HYS-3001', TIMESTAMP '2024-05-01 07:45:00', TIMESTAMP '2024-05-01 15:00:00', 'Tire puncture on rear wheel')
) AS v(number, started_at, resolved_at, description)
JOIN forklifts f ON f.number = v.number;
