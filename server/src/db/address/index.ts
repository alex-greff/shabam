import { Pool } from 'pg';
import KEYS from '@/keys';

interface AddressPools {
  [s: string]: Pool;
  [n: number]: Pool;
}

const addressDbPools: AddressPools = {};

// Initialize address db connections
for (let i = 0; i < KEYS.ADDRESS_DB_COUNT; i++) {
  const currDbKeys = KEYS.getAddressDbKeys(i);

  console.log("DB KEYS", currDbKeys); // TODO: remove

  const pool = new Pool({
    user: currDbKeys.PG_ADDRESS_USER,
    host: currDbKeys.PG_ADDRESS_HOST,
    database: currDbKeys.PG_ADDRESS_DATABASE,
    password: currDbKeys.PG_ADDRESS_PASSWORD,
    port: currDbKeys.PG_ADDRESS_PORT,
    ssl: KEYS.PRODUCTION,
  });

  pool.on('error', () => console.error('Lost PG address database connection'));

  addressDbPools[i] = pool;
}

function _checkDbAddress(addressDbNum: number) {
  if (addressDbNum < 0 || addressDbNum >= KEYS.ADDRESS_DB_COUNT) {
    throw `Address database '${addressDbNum}' does not exist`;
  }
}

export const getAddressDbPool = (addressDbNum: number): Pool => {
  _checkDbAddress(addressDbNum);
  return addressDbPools[addressDbNum];
};
