-- address table
DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
  address_enc INTEGER NOT NULL,
  PRIMARY KEY (address_enc)
);

-- coupling table
DROP TABLE IF EXISTS couple CASCADE;
CREATE TABLE couple(
  couple_enc BIGINT NOT NULL,
  address_enc INTEGER NOT NULL,
  CONSTRAINT address_fk FOREIGN KEY (address_enc)
    REFERENCES address (address_enc) MATCH SIMPLE
    ON UPDATE RESTRICT ON DELETE CASCADE
);