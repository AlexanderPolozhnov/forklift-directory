SET search_path TO forklift;

-- Удаляем старый индекс, если он есть
DROP INDEX IF EXISTS idx_forklifts_number;

-- Создаем уникальный индекс (регистронезависимый)
CREATE UNIQUE INDEX idx_forklifts_number_unique ON forklifts(LOWER(number));
