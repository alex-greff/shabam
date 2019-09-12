module.exports = {
    PG_MAIN_HOST: process.env.PG_MAIN_HOST,
    PG_MAIN_DATABASE: process.env.PG_MAIN_DATABASE,
    PG_MAIN_USER: process.env.PG_MAIN_USER,
    PG_MAIN_PORT: process.env.PG_MAIN_PORT,
    PG_MAIN_PASSWORD: process.env.PG_MAIN_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
    PRODUCTION: process.env.NODE_ENV === "production",
    getAddressDbKeys: (addressNum) => ({
        PG_ADDRESS_HOST: process.env[`PG_ADR${addressNum}_HOST`],
        PG_ADDRESS_DATABASE: process.env[`PG_ADR${addressNum}_DATABASE`],
        PG_ADDRESS_USER: process.env[`PG_ADR${addressNum}_USER`],
        PG_ADDRESS_PORT: process.env[`PG_ADR${addressNum}_PORT`],
        PG_ADDRESS_PASSWORD: process.env[`PG_ADR${addressNum}_PASSWORD`],
    }),
    ADDRESS_DB_COUNT: process.env.ADDRESS_DB_COUNT
};