const KEYS = require("../../keys");
const { Pool } = require("pg");

// Initialize address db connections
const addressPools = {};

const range = [ ...Array(KEYS.ADDRESS_DB_COUNT).keys() ];
range.forEach(idx => {
    const currDbKeys = KEYS.getAddressDbKeys(idx + 1);
    
    const pool = new Pool({
        user: currDbKeys.PG_ADDRESS_USER,
        host: currDbKeys.PG_ADDRESS_HOST,
        database: currDbKeys.PG_ADDRESS_DATABASE,
        password: currDbKeys.PG_ADDRESS_PASSWORD,
        port: currDbKeys.PG_ADDRESS_PORT,
        ssl: true
    });

    pool.on("error", () => console.error("Lost PG address database connection"));

    addressPools[idx] = pool;
});

function _checkAddressPool(addressPool) {
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
exports.query = (addressNum, queryText, ...params) => {
    const addressPool = addressPools[addressNum];

    _checkAddressPool(addressPool);

    return pool.query(queryText, params);
};