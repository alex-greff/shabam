const KEYS = require("../../keys");
const { Pool } = require("pg");

// Setup pool instance
const pool = new Pool({
    user: KEYS.PG_MAIN_USER,
    host: KEYS.PG_MAIN_HOST,
    database: KEYS.PG_MAIN_DATABASE,
    password: KEYS.PG_MAIN_PASSWORD,
    port: KEYS.PG_MAIN_PORT,
    ssl: true
});
pool.on("error", () => console.error("Lost PG main database connection"));

/**
 * Queries the postgres database. Uses pg-escape internally so function calls should be formatted accordingly.
 * 
 * @param {String} queryText The query text.
 * @param  {...String} params The list of parameters.
 */
exports.query = (queryText, ...params) => {
    return pool.query(queryText, params);
};