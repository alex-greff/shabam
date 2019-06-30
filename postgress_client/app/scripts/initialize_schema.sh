#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the run_query function
source "$SCRIPT_DIR/functions/run_query.sh"

# TODO: get this working

# Start command
read -d '' SCHEMA_INIT_QUERY << EOF
    -- user table
    DROP TABLE IF EXISTS user;
    CREATE TABLE user(
        user_id serial PRIMARY KEY,
        username VARCHAR (50) UNIQUE NOT NULL,
        password VARCHAR (50) NOT NULL,
        email VARCHAR (355) UNIQUE NOT NULL,
        role VARCHAR (50) NOT NULL,
        signup_date TIMESTAMP NOT NULL,
        last_login TIMESTAMP
    );

    -- fingerprint table
    DROP TABLE IF EXISTS fingerprint;
    CREATE TABLE fingerprint(
        fingerprint_id serial PRIMARY KEY,
        data json NOT NULL
    );

    -- track table
    DROP TABLE IF EXISTS track;
    CREATE TABLE track(
        track_id serial PRIMARY KEY,
        CONSTRAINT track_fingerprint_id_fkey FOREIGN KEY (fingerprint_id)
            REFERENCES fingerprint (fingerprint_id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION,
        title VARCHAR (50) UNIQUE NOT NULL,
        cover_image VARCHAR (355) NOT NULL,
        release_date TIMESTAMP,
        created_date TIMESTAMP NOT NULL,
        update_date TIMESTAMP NOT NULL,
        CONSTRAINT track_upload_user_id_fkey FOREIGN KEY (upload_user_id)
            REFERENCES user (user_id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION
    );

    -- search table
    DROP TABLE IF EXISTS search;
    CREATE TABLE search(
        user_id integer NOT NULL,
        track_id integer NOT NULL,
        PRIMARY KEY (user_id, track_id),
        CONSTRAINT search_user_id_fkey FOREIGN KEY (user_id)
            REFERENCES user (user_id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION,
        CONSTRAINT search_track_id_fkey FOREIGN KEY (track_id)
            REFERENCES track (track_id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION,
        search_date TIMESTAMP NOT NULL
    );

    -- artist table
    DROP TABLE IF EXISTS artist;
    CREATE TABLE artist(
        artist_id serial PRIMARY KEY,
        name VARCHAR (50) UNIQUE NOT NULL
    );

    -- track_artist table
    DROP TABLE IF EXISTS track_artist;
    CREATE TABLE track_artist(
        track_id integer NOT NULL,
        artist_id integer NOT NULL,
        PRIMARY KEY (track_id, artist_id),
        CONSTRAINT track_artist_track_id_fkey FOREIGN KEY (track_id)
            REFERENCES track (track_id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION,
        CONSTRAINT track_artist_artist_id_fkey FOREIGN KEY (artist_id)
            REFERENCES artist (artist_id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION
    );
EOF

run_query "$SCHEMA_INIT_QUERY"