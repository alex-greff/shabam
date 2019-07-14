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
        const fingerprintData = {"some":"json data"}; // TODO: generate fingerprint from worker

        const addTrackToDb = (i_sTitle, i_aArtists, i_sCoverImage, i_dReleaseDate, i_sEmail, i_oFingerprintData) => {
            const query = `
                DROP FUNCTION IF EXISTS insert_artist(artistName VARCHAR);

                CREATE OR REPLACE FUNCTION insert_artist(artistName VARCHAR)
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
                END; $$ LANGUAGE plpgsql;

                DROP FUNCTION IF EXISTS insert_artists(trackID INTEGER, artistNameArr VARCHAR[]);

                CREATE OR REPLACE FUNCTION insert_artists(trackID INTEGER, artistNameArr VARCHAR[])
                -- CREATE OR REPLACE FUNCTION insert_artists(trackID INTEGER)
                    RETURNS VOID AS $$
                DECLARE
                    -- artistNameArr VARCHAR[] := ARRAY['artist-1', 'artist-2'];
                    artistName VARCHAR;
                    currArtistID INTEGER;
                BEGIN
                    FOREACH artistName IN ARRAY artistNameArr
                    LOOP
                        currArtistID := insert_artist(artistName);
                        INSERT INTO track_artist(track_id, artist_id) VALUES (trackID, currArtistID);
                    END LOOP;

                    -- RETURN currArtistID;
                END; $$ LANGUAGE plpgsql;

                DO $artists$
                DECLARE
                    trackID INTEGER;
                BEGIN
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
                    RETURNING track_id INTO trackID;

                    PERFORM insert_artists(trackID, ARRAY[%s]);
                END $artists$;
            `;

            const sReleaseDateTimestamp = `to_timestamp(${new Date(i_dReleaseDate).getTime()} / 1000.0)`;
            const sNowTimestamp = `to_timestamp(${Date.now()} / 1000.0)`;
            const sFingerprintData = JSON.stringify(i_oFingerprintData);
            const sArtist = i_aArtists.map(sArtist => `'${sArtist}'`).join(", ");

            // TODO: remove
            // console.log(db.getComputedQuery(query, sFingerprintData, i_sEmail, i_sTitle, i_sCoverImage, sReleaseDateTimestamp, sNowTimestamp, sNowTimestamp, sArtist)); 

            return db.query(query, sFingerprintData, i_sEmail, i_sTitle, i_sCoverImage, sReleaseDateTimestamp, sNowTimestamp, sNowTimestamp, sArtist);
        };

        await addTrackToDb(title, artists, coverImage, releaseDate, email, fingerprintData);

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