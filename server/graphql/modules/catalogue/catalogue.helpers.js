const db = require("../../../db/main");
const address_db = require("../../../db/address");

async function _addArtistsToTrack(i_nTrackID, i_aArtists) {
    // Add the artist list for the track
    for (let sArtist of i_aArtists) {
        // Add artist to artist table, if missing
        const addToArtistTableQuery = `
            INSERT INTO artist (name)
                SELECT CAST($1 AS VARCHAR)
            WHERE NOT EXISTS (
                SELECT 1 FROM artist WHERE artist.name = $1
            )
        `;

        await db.query(addToArtistTableQuery, sArtist);

        // Add the track's artist list to the databse
        const addTrackArtistRelationQuery = `
            INSERT INTO track_artist 
                (track_id, artist_id)
            VALUES
                (
                    ( SELECT track_id FROM track WHERE track.track_id = $1 ),
                    ( SELECT artist_id FROM artist WHERE artist.name = $2 )
                );
        `;

        await db.query(addTrackArtistRelationQuery, i_nTrackID, sArtist);
    }
}


exports.getTrack = async (i_nTrackID) => {
    const trackQuery = `
        SELECT * FROM 
            (SELECT t.*, ua.email AS upload_user_account_email FROM track AS t
                INNER JOIN user_account AS ua 
                ON t.upload_user_account_id = ua.user_account_id) n1 
            WHERE n1.track_id = $1
    `;

    const artistsQuery = `
        SELECT a.name as artist_name FROM 
            track_artist AS ta
            INNER JOIN artist as a
            ON ta.artist_id = a.artist_id 
            WHERE ta.track_id = $1
    `;

    const dbQueries = [db.query(trackQuery, i_nTrackID), db.query(artistsQuery, i_nTrackID)];

    const [resTrack, resArtists] = await Promise.all(dbQueries);

    if (resTrack.rowCount <= 0) {
        throw new Error("Track not found");
    }

    // Construct artists list
    let aArtists = [];
    if (resArtists.rowCount > 0) {
        aArtists = resArtists.rows.map(i_oCurrArtist => i_oCurrArtist.artist_name);
    }

    const trackData = { ...resTrack.rows[0], artists: [ ...aArtists ] };

    // Construct and return track data
    return {
        _id: trackData.track_id,
        addressDatabase: trackData.address_database,
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
        addressDatabase: oCurrRawTrackData.address_database,
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

exports.addTrack = async (i_sTitle, i_aArtists, i_sCoverImage, i_sReleaseDate, i_sEmail) => {
    const dReleaseDate = new Date(i_sReleaseDate);
    const dNow = new Date();

    const insertTrackQuery = `
        INSERT INTO track
            (title, cover_image, release_date, created_date, update_date, upload_user_account_id)
        VALUES
            ($2, $3, $4, $5, $5, ( SELECT user_account_id FROM user_account AS ua WHERE ua.email = $1 ))
        RETURNING track_id;
    `;

    const insertTrackRes = await db.query(insertTrackQuery, i_sEmail, i_sTitle, i_sCoverImage, dReleaseDate, dNow);

    const { track_id : trackID } = insertTrackRes.rows[0];

    // Add the artist list to the database
    await _addArtistsToTrack(trackID, i_aArtists);

    return trackID;
};

exports.editTrack = async (i_nTrackID, i_sNewTitle, i_aNewArtists, i_sNewCoverImage, i_sNewReleaseDate) => {
    const dNow = new Date();

    const aUpdateArgs = [];
    let sUpdateListString = `update_date = $1`;

    let nCurrParam = 2;

    if (i_sNewTitle) {
        sUpdateListString += `, title = $${nCurrParam}`;
        aUpdateArgs.push(i_sNewTitle);
        nCurrParam++;
    }

    if (i_sNewCoverImage) {
        sUpdateListString += `, cover_image = $${nCurrParam}`;
        aUpdateArgs.push(i_sNewCoverImage);
        nCurrParam++;
    }

    if (i_sNewReleaseDate) {
        const dReleaseDate = new Date(i_sNewReleaseDate);
        sUpdateListString += `, release_date = $${nCurrParam}`;
        aUpdateArgs.push(dReleaseDate);
        nCurrParam++;
    }

    let trackQuery = `
        UPDATE track AS t SET ${sUpdateListString} WHERE t.track_id = $${nCurrParam}
    `;

    const bUpdateArtists = i_aNewArtists && i_aNewArtists.length > 0;

    // Check if no items are actually being updated
    if (aUpdateArgs.length <= 0 && !bUpdateArtists) {
        throw new Error("Error updating track, at least one field must be provided to update");
    }

    // Add the track query to the list of promises to run
    await db.query(trackQuery, dNow, ...aUpdateArgs, i_nTrackID);

    // Make the update artists query, if needed
    if (bUpdateArtists) {
        // Remove the list of existing artists
        const removeArtistsListQuery = `
            DELETE FROM track_artist AS ta WHERE ta.track_id = $1;
        `;

        await db.query(removeArtistsListQuery, i_nTrackID);

        // Add in the new artist list
        await _addArtistsToTrack(i_nTrackID, i_aNewArtists);
    }
};

exports.deleteTrack = async (i_nTrackID) => {
    // Get the address database where the track address data are stored
    const addressDbQuery = `
        SELECT address_database FROM track AS t WHERE t.track_id = $1
    `;

    const addressDbRes = await db.query(addressDbQuery, i_nTrackID);

    if (addressDbRes.rowCount <= 0) {
        throw `Track '${i_nTrackID}' not found`;
    }

    const addressDb = addressDbRes.rows[0].address_database;

    // TODO: delete addresses related to this track ID

    // Delete the track from the track table
    const deleteQuery = `
        DELETE FROM track AS t WHERE t.track_id = $1
    `;

    return db.query(deleteQuery, i_nTrackID);
};