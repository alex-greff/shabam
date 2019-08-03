const KEYS = require("../keys");
const { Pool } = require("pg");
const escape = require("pg-escape");

// Setup pool instance
const pool = new Pool({
    user: KEYS.PG_USER,
    host: KEYS.PG_HOST,
    database: KEYS.PG_DATABASE,
    password: KEYS.PG_PASSWORD,
    port: KEYS.PG_PORT,
    ssl: true
});
pool.on("error", () => console.error("Lost PG connection"));

/**
 * Queries the postgres database. Uses pg-escape internally so function calls should be formatted accordingly.
 * 
 * @param {String} text The query text.
 * @param  {...String} params The list of parameters.
 */
exports.query = (text, ...params) => {
    const sEscapedQuery = escape(text, ...params);
    return pool.query(sEscapedQuery);
};

/**
 * Returns the string of the computed and properly escaped query.
 * 
 * @param {String} text The query text.
 * @param  {...String} params The list of parameters.
 */
exports.getComputedQuery = (text, ...params) => {
    return escape(text, ...params);
};