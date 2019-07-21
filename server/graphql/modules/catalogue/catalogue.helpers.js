const db = require("../../../db");

exports.findTrackID = async (i_sTitle, i_aArtists) => {
    const query = `
        SELECT n3.track_id FROM
            (SELECT n1.artist_id, n1.artist_name, n1.track_id, n2.title as track_title FROM 
                (SELECT a.artist_id, a.name as artist_name, ta.track_id 
                    FROM artist AS a INNER JOIN track_artist AS ta ON a.artist_id = ta.artist_id) n1 
                INNER JOIN 
                    (SELECT track_id, title FROM track) n2
                ON (n1.track_id = n2.track_id)
            ) n3
            WHERE n3.track_title = %L AND n3.artist_name IN (%s) LIMIT 1;
    `;

    const sArtistList = i_aArtists.map(sArtist => `'${sArtist}'`).join(", ");

    const res = await db.query(query, i_sTitle, sArtistList);

    if (res.rowCount <= 0) {
        throw new Error("Track not found");
    }

    return res.rows[0].track_id;
};

exports.getTrack = async (i_nTrackID) => {
    const trackQuery = `
        SELECT * FROM 
            (SELECT t.*, ua.email AS upload_user_account_email FROM track AS t
                INNER JOIN user_account AS ua 
                ON t.upload_user_account_id = ua.user_account_id) n1 
            WHERE n1.track_id = %L
    `

    const resTrack = await db.query(trackQuery, `${i_nTrackID}`);

    if (resTrack.rowCount <= 0) {
        throw new Error("Track not found");
    }

    const artistsQuery = `
        SELECT a.name as artist_name FROM 
            track_artist AS ta
            INNER JOIN artist as a
            ON ta.artist_id = a.artist_id 
            WHERE ta.track_id = %L
    `;

    const resArtists = await db.query(artistsQuery, `${i_nTrackID}`);
    let aArtists = [];

    if (resArtists.rowCount > 0) {
        aArtists = resArtists.rows.map(i_oCurrArtist => i_oCurrArtist.artist_name);
    }

    const trackData = { ...resTrack.rows[0], artists: [ ...aArtists ] };

    // Construct and return track data
    return {
        _id: trackData.track_id,
        fingerprintData: JSON.stringify(trackData.fingerprint_data), // TODO: remove the stringify
        metaData: {
            title: trackData.title,
            artists: trackData.artists,
            coverImage: trackData.cover_image,
            uploaderEmail: trackData.upload_user_account_email,
            releaseDate: trackData.release_date,
            createdDate: trackData.created_date,
            updatedDate: trackData.update_date
        }
    }
};

exports.getAllTracks = async () => {
    const allTracksQuery = `
        SELECT t.*, ua.email AS upload_user_account_email FROM track AS t
            INNER JOIN user_account AS ua
            ON (t.upload_user_account_id = ua.user_account_id);
    `;

    const trackToArtistsMapQuery = `
        SELECT n1.artist_name, n2.track_id FROM 
            (SELECT a.artist_id, a.name as artist_name, ta.track_id 
                FROM artist AS a INNER JOIN track_artist AS ta ON a.artist_id = ta.artist_id) n1 
            INNER JOIN 
                (SELECT track_id, title FROM track) n2
            ON (n1.track_id = n2.track_id);
    `;

    const aDbQueries = [db.query(allTracksQuery), db.query(trackToArtistsMapQuery)];
    const [allTracksRes, trackToArtistsMapRes] = await Promise.all(aDbQueries);

    const trackToArtistsMap = trackToArtistsMapRes.rows.reduce((acc, oCurrRawMap) => {
        const { artist_name, track_id } = oCurrRawMap;

        if (!acc[track_id]) {
            return {
                ...acc,
                [track_id]: [artist_name]
            };
        }

        acc[track_id].push(artist_name);

        return { ...acc };
    }, {});

    const aRawTrackData = allTracksRes.rows.map(oTrack => ({
        ...oTrack,
        artists: (trackToArtistsMap[oTrack.track_id]) ? [...trackToArtistsMap[oTrack.track_id]] : []
    }));

    const aAllTracks = aRawTrackData.map(oCurrRawTrackData => ({
        _id: oCurrRawTrackData.track_id,
        fingerprintData: JSON.stringify(oCurrRawTrackData.fingerprint_data), // TODO: remove the stringify
        metaData: {
            title: oCurrRawTrackData.title,
            artists: oCurrRawTrackData.artists,
            coverImage: oCurrRawTrackData.cover_image,
            uploaderEmail: oCurrRawTrackData.upload_user_account_email,
            releaseDate: oCurrRawTrackData.release_date,
            createdDate: oCurrRawTrackData.created_date,
            updatedDate: oCurrRawTrackData.update_date
        }
    }));

    return aAllTracks;
};

exports.addTrack = (i_sTitle, i_aArtists, i_sCoverImage, i_sReleaseDate, i_sEmail, i_oFingerprintData) => {
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
        END; $$ LANGUAGE plpgsql;

        DO $$
        DECLARE
            trackID INTEGER;
        BEGIN
            WITH UA_TABLE AS (
                SELECT user_account_id FROM user_account AS ua WHERE ua.email = %L
            )
            INSERT INTO track 
                (title, cover_image, release_date, created_date, update_date,
                fingerprint_data, upload_user_account_id)
            SELECT 
                %L, %L, %s, %s, %s, %L, UA_TABLE.user_account_id
            FROM UA_TABLE
            RETURNING track_id INTO trackID;

            PERFORM insert_artists(trackID, ARRAY[%s]);
        END $$;
    `;

    const sReleaseDateTimestamp = `to_timestamp(${new Date(i_sReleaseDate).getTime()} / 1000.0)`;
    const sNowTimestamp = `to_timestamp(${Date.now()} / 1000.0)`;
    const sFingerprintData = JSON.stringify(i_oFingerprintData);
    const sArtistList = i_aArtists.map(sArtist => `'${sArtist}'`).join(", ");

    return db.query(query, i_sEmail, i_sTitle, i_sCoverImage, sReleaseDateTimestamp, sNowTimestamp, sNowTimestamp, sFingerprintData, sArtistList);
};

exports.editTrack = async (i_nTrackID, i_sNewTitle, i_aNewArtists, i_sNewCoverImage, i_sNewReleaseDate, i_oNewFingerprintData) => {
    const sNowTimestamp = `to_timestamp(${Date.now()} / 1000.0)`;

    const aUpdateArgs = [];
    let sUpdateListString = "update_date = %s";

    if (i_sNewTitle) {
        sUpdateListString += ", title = %L";
        aUpdateArgs.push(i_sNewTitle);
    }

    if (i_sNewCoverImage) {
        sUpdateListString += ", cover_image = %L";
        aUpdateArgs.push(i_sNewCoverImage);
    }

    if (i_sNewReleaseDate) {
        const sReleaseDateTimestamp = `to_timestamp(${new Date(i_sNewReleaseDate).getTime()} / 1000.0)`;
        sUpdateListString += ", release_date = %s";
        aUpdateArgs.push(sReleaseDateTimestamp);
    }

    if (i_oNewFingerprintData) {
        const sFingerprintData = JSON.stringify(i_oFingerprintData);
        sUpdateListString += ", fingerprint_data = %s";
        aUpdateArgs.push(sFingerprintData);
    }

    let trackQuery = `
        UPDATE track AS t SET ${sUpdateListString} WHERE t.track_id = %L
    `;

    const bUpdateArtists = i_aNewArtists && i_aNewArtists.length > 0;

    // Check if no items are actually being updated
    if (aUpdateArgs.length <= 0 && !bUpdateArtists) {
        throw new Error("Error updating track, at least one field must be provided to update");
    }

    // Add the track query to the list of promises to run
    await db.query(trackQuery, sNowTimestamp, ...aUpdateArgs, `${i_nTrackID}`)

    // Make the update artists query, if needed
    if (bUpdateArtists) {
        const artistQuery = `
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
            END; $$ LANGUAGE plpgsql;            

            DO $$
            DECLARE
                trackID INTEGER := %L;
            BEGIN
                -- Remove any existing artists mapped to the track
                DELETE FROM track_artist AS ta WHERE ta.track_id = trackID;
                -- Add the updated artists in
                PERFORM insert_artists(trackID, ARRAY[%s]);
            END $$
        `;

        const sArtistList = i_aNewArtists.map(sArtist => `'${sArtist}'`).join(", ");

        await db.query(artistQuery, `${i_nTrackID}`, sArtistList);
    }
};

exports.deleteTrack = (i_nTrackID) => {
    const query = `
        DELETE FROM track AS t WHERE t.track_id = %L
    `;  

    return db.query(query, `${i_nTrackID}`);
}