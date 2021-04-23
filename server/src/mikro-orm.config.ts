import { Options } from "@mikro-orm/core";
import KEYS from "./keys";

const config: Options = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  host: KEYS.PG_METADATA_HOST,
  port: KEYS.PG_METADATA_PORT,
  user: KEYS.PG_METADATA_USER,
  password: KEYS.PG_METADATA_PASSWORD,
  dbName: KEYS.PG_METADATA_DATABASE,
  type: "postgresql",
  debug: !KEYS.PRODUCTION,
};

export default config;
