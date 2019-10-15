-- address table
DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
    address_id SERIAL PRIMARY KEY,
    address_enc INTEGER NOT NULL,
    couple_enc BIGINT NOT NULL
);