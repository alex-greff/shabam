import { Pool, QueryResult } from "@/db/metadata/node_modules/pg";
import KEYS from "../../keys";

// const KEYS = require("../../keys");
// const { Pool } = require("pg");

interface AddressPools {
  [s: string]: Pool;
  [n: number]: Pool;
}

// Initialize address db connections
const addressPools: AddressPools = {};

// const range = [ ...Array(KEYS.ADDRESS_DB_COUNT).keys() ];
// range.forEach(idx => {
//     const currDbKeys = KEYS.getAddressDbKeys(idx + 1);

//     const pool = new Pool({
//         user: currDbKeys.PG_ADDRESS_USER,
//         host: currDbKeys.PG_ADDRESS_HOST,
//         database: currDbKeys.PG_ADDRESS_DATABASE,
//         password: currDbKeys.PG_ADDRESS_PASSWORD,
//         port: currDbKeys.PG_ADDRESS_PORT,
//         ssl: true
//     });

//     pool.on("error", () => console.error("Lost PG address database connection"));

//     addressPools[idx] = pool;
// });

function _checkAddressPool(addressPool: Pool, addressNum: number) {
  if (!addressPool) {
    throw `Address database '${addressNum}' does not exist`;
  }
}

/**
 * Queries the given address database.
 *
 * @param {Number} addressNum The number of the address database.
 * @param {String} queryText The query text.
 * @param  {...String} params The list of parameters.
 */
exports.query = (
  addressNum: number,
  queryText: string,
  ...params: any
): Promise<QueryResult<any>> => {
  const addressPool = addressPools[addressNum];

  _checkAddressPool(addressPool, addressNum);

  return addressPool.query(queryText, params);
};
