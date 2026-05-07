CREATE TABLE incidents (
    id           BIGSERIAL PRIMARY KEY,
    forklift_id  BIGINT NOT NULL REFERENCES forklifts(id),
    started_at   TIMESTAMP NOT NULL,
    resolved_at  TIMESTAMP,
    description  TEXT
);
