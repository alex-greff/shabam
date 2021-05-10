# Postgress Client

A container for automating the configuration of the postgres server. The container contains a properly installed version of `psql` configured to connect to the database.

## Databases
* `main`: the main database containing user and track information
* `address-0`: the first track address database
* `address-1`: the second track address database
* `address-2`: the third track address database

## Commands

* `bash run build` Builds the docker container locally.
* `$bash run start:it--[database-name]` Starts an interactive shell terminal in the container configured for the given database.
* `$bash run start:psql--[database-name]` Starts an interactive psql terminal instance connected to the given database.
* `$bash run exec:init-schema--[database-name]` Initializes the postgres schema. **NOTE** this will wipe all the data in the given database so use with care!