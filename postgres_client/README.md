# Postgress Client

A container for automating the configuration of the postgres server. The container contains a properly installed version of `psql` configured to connect to the database.

## Databases
* `main`: the main database containing user and track information
<!-- TODO: put back in later -->
<!-- * `address-1`: the first track address database
* `address-2`: the second track address database
* `address-3`: the third track address database -->

## Commands

* `npm run build` Builds the docker container locally.
* `$ npm run start:it--[database-name]` Starts an interactive shell terminal in the container configured for the given database.
* `$ npm run start:psql--[database-name]` Starts an interactive psql terminal instance connected to the given database.
* `$ npm run exec:init-schema--[database-name]` Initializes the postgres schema. **NOTE** this will wipe all the data in the given database so use with care!