# Postgress Client

A container for automating the configuration of the postgres server. The container contains a properly installed version of `psql` configured to connect to the database.

## Commands

* `$ npm run start:it` Starts an interactive shell terminal in the container.
* `$ npm run start:psql` Starts an interactive psql terminal instance connected to the database.
* `$ npm run exec:init-schema` Initializes the postgres schema. **NOTE** this will wipe all the data in the database so use with care!