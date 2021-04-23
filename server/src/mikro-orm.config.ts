import { Options } from "@mikro-orm/core";
// import { ArtistEntity } from "./entities/Artist.entity";
// import { SearchEntity } from "./entities/Search.entity";
// import { SearchResultEntity } from "./entities/SearchResult.entity";
// import { TrackEntity } from "./entities/Track.entity";
// import { UserAccountEntity } from "./entities/UserAccount.entity";
import KEYS from "./keys";

const config: Options = {
  // entities: [ArtistEntity, SearchEntity, SearchResultEntity, TrackEntity, UserAccountEntity],
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  host: KEYS.PG_METADATA_HOST,
  port: KEYS.PG_METADATA_PORT,
  user: KEYS.PG_METADATA_USER,
  password: KEYS.PG_METADATA_PASSWORD,
  dbName: KEYS.PG_METADATA_DATABASE,
  type: "postgresql",
  debug: !KEYS.PRODUCTION
};

export default config;

// export default {
//   entities: [Author, Book, BookTag],
//   dbName: 'my-db-name',
//   type: 'mongo', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
// };