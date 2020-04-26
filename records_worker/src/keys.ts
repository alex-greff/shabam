export default {
    PRODUCTION: process.env.NODE_ENV === "production",
    getAddressDbKeys: (addressNum: number) => ({
        PG_ADDRESS_HOST: process.env[`PG_ADR${addressNum}_HOST`],
        PG_ADDRESS_DATABASE: process.env[`PG_ADR${addressNum}_DATABASE`],
        PG_ADDRESS_USER: process.env[`PG_ADR${addressNum}_USER`],
        PG_ADDRESS_PORT: process.env[`PG_ADR${addressNum}_PORT`],
        PG_ADDRESS_PASSWORD: process.env[`PG_ADR${addressNum}_PASSWORD`],
    }),
    ADDRESS_DB_COUNT: (process.env.ADDRESS_DB_COUNT) ? parseInt(process.env.ADDRESS_DB_COUNT) : 0
};