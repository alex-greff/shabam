const axios = require("axios");
const db = require("../../../db");

// TODO: implement
module.exports = {
    getAllTracks: async (root, args, context) => {
        return [
            {
                _id: "fe3f32wfwesd",
                fingerprintID: "adffwf2er2w34",
                metaData: {
                    title: "temp",
                    artists: ["artist1", "artist2"],
                    coverImage: "some image link",
                    releaseDate: "some date",
                    createdDate: "some date",
                    updatedDate: "some date"
                }
            }
        ]
    },
    getTrack: async (root, { trackID }, context) => {
        const res = await axios.post("http://fingerprint_worker:5001/generate_fingerprint");

        console.log("RES", res.data);

        return {
            _id: "fe3f32wfwesd",
            fingerprintID: "adffwf2er2w34",
            metaData: {
                title: "temp",
                artists: ["artist1", "artist2"],
                coverImage: "some image link",
                releaseDate: "some date",
                createdDate: "some date",
                updatedDate: "some date"
            }
        }
    },
    addTrack: async (root, { trackData }, context) => {
        const { title, artists, coverImage, releaseDate } = trackData;
        const { email } = context.userData;

        const addTrackToDb = (title, artists, coverImage, releaseDate, email) => {
            const query = `
                /*CREATE OR REPLACE FUNCTION insert_artist(artistName VARCHAR)
                    RETURNS INTEGER AS $$
                DECLARE
                    artistID INTEGER;
                BEGIN
                    IF EXISTS (SELECT 1 FROM artist WHERE artist.name = artistName) THEN
                        SELECT artist.artist_id INTO artistID FROM artist WHERE artist.name = artistName;
                    ELSE
                        INSERT INTO artist(name) VALUES (artistName) RETURNING artist_id INTO artistID;
                    END IF;

                    RETURN artistID;
                END;    

                CREATE OR REPLACE FUNCTION insert_artists(trackID INTEGER, artistNameArr varchar[])
                    RETURNS INTEGER AS $$
                DECLARE
                    -- arr varchar[] := array[];
                    currArtistID INTEGER;
                BEGIN
                    FOREACH artistName SLICE 1 IN ARRAY artistNameArr
                    LOOP
                        currArtistID := insert_artist(artistName);
                        INSERT INFO track_artist(track_id, artist_id) VALUES (trackID, currArtistID);
                    END LOOP;
                END;*/

                WITH FP_TABLE AS (
                    INSERT INTO fingerprint(data) VALUES (%L) RETURNING fingerprint_id
                ), UA_TABLE AS (
                    SELECT user_account_id FROM user_account AS ua WHERE ua.email = %L
                )
                INSERT INTO track 
                    (title, cover_image, release_date, created_date, update_date,
                    fingerprint_id, upload_user_account_id)
                SELECT 
                    %L, %L, %s, %s, %s, FP_TABLE.fingerprint_id, UA_TABLE.user_account_id
                FROM FP_TABLE, UA_TABLE
                
                -- TODO: run insert_artists function
            `;

            const releaseDateTimestamp = `to_timestamp(${new Date(releaseDate).getTime()} / 1000.0)`;
            const nowTimestamp = `to_timestamp(${Date.now()} / 1000.0)`;
            const fingerprintData = JSON.stringify({"some":"json data"});

            console.log(db.getComputedQuery(query, fingerprintData, email, title, coverImage, releaseDateTimestamp, nowTimestamp, nowTimestamp));

            return db.query(query, fingerprintData, email, title, coverImage, releaseDateTimestamp, nowTimestamp, nowTimestamp);
        };

        const temp = await addTrackToDb(title, artists, coverImage, releaseDate, email);

        console.log(temp);


        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    },
    editTrack: async (root, { trackData }, context) => {
        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    }    
};