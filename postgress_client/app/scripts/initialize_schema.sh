#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the run_query function
source "$SCRIPT_DIR/functions/run_query.sh"

# TODO: get this working

# Start command
read -d '' SCHEMA_INIT_QUERY << EOF
    -- user table
    DROP TABLE IF EXISTS user_account CASCADE;
    CREATE TABLE user_account(
        user_account_id serial PRIMARY KEY,
        username VARCHAR (50) UNIQUE NOT NULL,
        password VARCHAR (50) NOT NULL,
        email VARCHAR (355) UNIQUE NOT NULL,
        role VARCHAR (50) NOT NULL,
        signup_date TIMESTAMP NOT NULL,
        last_login TIMESTAMP
    );

    -- fingerprint table
    DROP TABLE IF EXISTS fingerprint CASCADE;
    CREATE TABLE fingerprint(
        fingerprint_id serial PRIMARY KEY,
        data json NOT NULL
    );

    -- track table
    DROP TABLE IF EXISTS track CASCADE;
    CREATE TABLE track(
        track_id serial PRIMARY KEY,
        fingerprint_id integer NOT NULL,
        upload_user_account_id integer NOT NULL,
        title VARCHAR (50) UNIQUE NOT NULL,
        cover_image VARCHAR (355) NOT NULL,
        release_date TIMESTAMP,
        created_date TIMESTAMP NOT NULL,
        update_date TIMESTAMP NOT NULL,
        CONSTRAINT track_fingerprint_id_fkey FOREIGN KEY (fingerprint_id)
            REFERENCES fingerprint (fingerprint_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE,
        CONSTRAINT track_upload_user_account_id_fkey FOREIGN KEY (upload_user_account_id)
            REFERENCES user_account (user_account_id) MATCH SIMPLE
            ON UPDATE RESTRICT ON DELETE CASCADE
    );

    -- search table
    DROP TABLE IF EXISTS search CASCADE;
    CREATE TABLE search(
        user_account_id integer NOT NULL,
        track_id integer NOT NULL,
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
        artist_id serial PRIMARY KEY,
        name VARCHAR (50) UNIQUE NOT NULL
    );

    -- track_artist table
    DROP TABLE IF EXISTS track_artist CASCADE;
    CREATE TABLE track_artist(
        track_id integer NOT NULL,
        artist_id integer NOT NULL,
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