export default {
    PG_MAIN_HOST: process.env.PG_MAIN_HOST,
    PG_MAIN_DATABASE: process.env.PG_MAIN_DATABASE,
    PG_MAIN_USER: process.env.PG_MAIN_USER,
    PG_MAIN_PORT: process.env.PG_MAIN_PORT ? parseInt(process.env.PG_MAIN_PORT) : undefined,
    PG_MAIN_PASSWORD: process.env.PG_MAIN_PASSWORD,
    PRODUCTION: process.env.NODE_ENV === "production",
    getAddressDbKeys: (addressNum: number) => {
        const currPort = process.env[`PG_ADR${addressNum}_PORT`];
        return {
            PG_ADDRESS_HOST: process.env[`PG_ADR${addressNum}_HOST`],
            PG_ADDRESS_DATABASE: process.env[`PG_ADR${addressNum}_DATABASE`],
            PG_ADDRESS_USER: process.env[`PG_ADR${addressNum}_USER`],
            PG_ADDRESS_PORT: currPort ? parseInt(currPort) : undefined,
            PG_ADDRESS_PASSWORD: process.env[`PG_ADR${addressNum}_PASSWORD`],
        };
    },
    ADDRESS_DB_COUNT: (process.env.ADDRESS_DB_COUNT) ? parseInt(process.env.ADDRESS_DB_COUNT) : 0,
    SESSION_SECRET: process.env.SESSION_SECRET
};