module.exports = {
    pgHost: process.env.PG_HOST,
    pgDatabase: process.env.PG_DATABASE,
    pgUser: process.env.PG_USER,
    pgPort: process.env.PG_PORT,
    pgPassword: process.env.PG_PASSWORD,
    PRODUCTION: process.env.NODE_ENV === "production"
};