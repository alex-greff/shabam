module.exports = {
    PG_HOST: process.env.PG_HOST,
    PG_DATABASE: process.env.PG_DATABASE,
    PG_USER: process.env.PG_USER,
    PG_PORT: process.env.PG_PORT,
    PG_PASSWORD: process.env.PG_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
    PRODUCTION: process.env.NODE_ENV === "production"
};