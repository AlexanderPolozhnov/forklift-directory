CREATE TABLE forklifts (
    id             BIGSERIAL PRIMARY KEY,
    brand          VARCHAR(255) NOT NULL,
    number         VARCHAR(100) NOT NULL,
    load_capacity  NUMERIC(10, 3) NOT NULL,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    modified_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_by    VARCHAR(255) NOT NULL DEFAULT 'system'
);

CREATE INDEX idx_forklifts_number ON forklifts(LOWER(number));
