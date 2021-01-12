import * as Config from '@/config';

export default {
  PRODUCTION: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT
    ? parseInt(process.env.PORT)
    : undefined || Config.defaultPort,
  PG_METADATA_HOST: process.env.PG_METADATA_HOST!,
  PG_METADATA_DATABASE: process.env.PG_METADATA_DATABASE!,
  PG_METADATA_USER: process.env.PG_METADATA_USER!,
  PG_METADATA_PORT: process.env.PG_METADATA_PORT
    ? parseInt(process.env.PG_METADATA_PORT)
    : undefined,
  PG_METADATA_PASSWORD: process.env.PG_METADATA_PASSWORD!,
  // TODO: put back in later?
  // getAddressDbKeys: (addressNum: number) => {
  //     const currPort = process.env[`PG_ADR${addressNum}_PORT`];
  //     return {
  //         PG_ADDRESS_HOST: process.env[`PG_ADR${addressNum}_HOST`],
  //         PG_ADDRESS_DATABASE: process.env[`PG_ADR${addressNum}_DATABASE`],
  //         PG_ADDRESS_USER: process.env[`PG_ADR${addressNum}_USER`],
  //         PG_ADDRESS_PORT: currPort ? parseInt(currPort) : undefined,
  //         PG_ADDRESS_PASSWORD: process.env[`PG_ADR${addressNum}_PASSWORD`],
  //     };
  // },
  // ADDRESS_DB_COUNT: (process.env.ADDRESS_DB_COUNT) ? parseInt(process.env.ADDRESS_DB_COUNT) : 0,
  REDIS_SESSION_HOST: process.env.REDIS_SESSION_HOST!,
  REDIS_SESSION_PORT: process.env.REDIS_SESSION_PORT
    ? parseInt(process.env.REDIS_SESSION_PORT!)
    : undefined,
  REDIS_SESSION_PASSWORD: process.env.REDIS_SESSION_PASSWORD!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
};
