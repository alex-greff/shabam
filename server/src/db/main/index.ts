import KEYS from "../../keys";
import { Pool, QueryResult } from "pg";

// Setup pool instance
const pool = new Pool({
  user: KEYS.PG_MAIN_USER,
  host: KEYS.PG_MAIN_HOST,
  database: KEYS.PG_MAIN_DATABASE,
  password: KEYS.PG_MAIN_PASSWORD,
  port: KEYS.PG_MAIN_PORT,
  ssl: KEYS.PRODUCTION ? true : false,
});
pool.on("error", () => console.error("Lost PG main database connection"));

/**
 * Queries the postgres database. Uses pg-escape internally so function calls should be formatted accordingly.
 *
 * @param {String} queryText The query text.
 * @param  {...Any} params The list of parameters.
 */
export function query(
  queryText: string,
  ...params: any[]
): Promise<QueryResult<any>> {
  return pool.query(queryText, params);
}
