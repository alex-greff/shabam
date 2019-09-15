#!/bin/bash

SCRIPTS_DIR="/app/scripts"

# Include the run_query function
source "$SCRIPTS_DIR/functions/run_query.sh"

# TODO: get this working

# Start command
read -d '' SCHEMA_INIT_QUERY << EOF
    -- user table
    /*DROP TABLE IF EXISTS user_account CASCADE;
    CREATE TABLE user_account(
        user_account_id SERIAL PRIMARY KEY,
        password CHAR (60) NOT NULL,
        email VARCHAR (355) UNIQUE NOT NULL,
        role VARCHAR (50) NOT NULL,
        signup_date TIMESTAMP NOT NULL,
        last_login TIMESTAMP
    );*/

    -- track table
    DROP TABLE IF EXISTS track CASCADE;
    CREATE TABLE track(
        track_id SERIAL PRIMARY KEY,
        upload_user_account_id INTEGER NOT NULL,
        title VARCHAR (50) UNIQUE NOT NULL,
        cover_image VARCHAR (355) NOT NULL,
        address_database INTEGER,
        release_date TIMESTAMP,
        created_date TIMESTAMP NOT NULL,
        update_date TIMESTAMP NOT NULL,
        CONSTRAINT track_upload_user_account_id_fkey FOREIGN KEY (upload_user_account_id)
            REFERENCES user_account (user_account_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE
    );

    -- search table
    DROP TABLE IF EXISTS search CASCADE;
    CREATE TABLE search(
        user_account_id INTEGER NOT NULL,
        track_id INTEGER NOT NULL,
        PRIMARY KEY (user_account_id, track_id),
        CONSTRAINT search_user_account_id_fkey FOREIGN KEY (user_account_id)
            REFERENCES user_account (user_account_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE,
        CONSTRAINT search_track_id_fkey FOREIGN KEY (track_id)
            REFERENCES track (track_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE,
        search_date TIMESTAMP NOT NULL
    );

    -- artist table
    DROP TABLE IF EXISTS artist CASCADE;
    CREATE TABLE artist(
        artist_id SERIAL PRIMARY KEY,
        name VARCHAR (50) UNIQUE NOT NULL
    );

    -- track_artist table
    DROP TABLE IF EXISTS track_artist CASCADE;
    CREATE TABLE track_artist(
        track_id INTEGER NOT NULL,
        artist_id INTEGER NOT NULL,
        PRIMARY KEY (track_id, artist_id),
        CONSTRAINT track_artist_track_id_fkey FOREIGN KEY (track_id)
            REFERENCES track (track_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE,
        CONSTRAINT track_artist_artist_id_fkey FOREIGN KEY (artist_id)
            REFERENCES artist (artist_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE
    );
EOF

run_query "$SCHEMA_INIT_QUERY"