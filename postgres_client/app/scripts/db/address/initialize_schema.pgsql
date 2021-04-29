-- coupling table
DROP TABLE IF EXISTS couple CASCADE;
CREATE TABLE couple(
  couple_enc BIGINT NOT NULL,
  address_enc INTEGER NOT NULL
);