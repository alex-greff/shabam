import { Track } from "../../../types";
import * as db from "../../../db/main";
import * as address_db from "../../../db/address";

// const db = require("../../../db/main");
// const address_db = require("../../../db/address");

async function _addArtistsToTrack(trackID: number, artists: string[]): Promise<void> {
    // Add the artist list for the track
    for (let artist of artists) {
        // Add artist to artist table, if missing
        const addToArtistTableQuery = `
            INSERT INTO artist (name)
                SELECT CAST($1 AS VARCHAR)
            WHERE NOT EXISTS (
                SELECT 1 FROM artist WHERE artist.name = $1
            )
        `;

        await db.query(addToArtistTableQuery, artist);

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

        await db.query(addTrackArtistRelationQuery, trackID, artist);
    }
}


export async function getTrack(trackID: number): Promise<Track> {
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

    const dbQueries = [db.query(trackQuery, trackID), db.query(artistsQuery, trackID)];

    const [resTrack, resArtists] = await Promise.all(dbQueries);

    if (resTrack.rowCount <= 0) {
        throw new Error("Track not found");
    }

    // Construct artists list
    let aArtists = [];
    if (resArtists.rowCount > 0) {
        aArtists = resArtists.rows.map((i_oCurrArtist: any) => i_oCurrArtist.artist_name);
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

export async function getAllTracks(): Promise<Track[]> {
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

    const trackToArtistsMap = trackToArtistsMapRes.rows.reduce((acc: any, oCurrRawMap: any) => {
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

    const aRawTrackData = allTracksRes.rows.map((oTrack:any) => ({
        ...oTrack,
        artists: (trackToArtistsMap[oTrack.track_id]) ? [...trackToArtistsMap[oTrack.track_id]] : []
    }));

<<<<<<< HEAD:server/graphql/modules/catalogue/catalogue.helpers.ts
    const allTracks = aRawTrackData.map(oCurrRawTrackData => ({
=======
    const allTracks = aRawTrackData.map((oCurrRawTrackData:any) => ({
>>>>>>> typescript:server/graphql/modules/catalogue/catalogue.helpers.js
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

    return allTracks;
};

export async function addTrack(title: string, artists: string[], email: string, coverImage?: string, releaseDate?: string): Promise<number> {
    const dReleaseDate = (releaseDate) ? new Date(releaseDate) : new Date();
    const dNow = new Date();

    const insertArgs = [title, dReleaseDate, dNow];
    let insertListString = `title, release_date, created_date, update_date, upload_user_account_id`;
    let insertIndicesString = `$2, $3, $4, $4, ( SELECT user_account_id FROM user_account AS ua WHERE ua.email = $1 )`;

    if (coverImage) {
        insertListString += ", cover_image";
        insertIndicesString += ", $5";
        insertArgs.push(coverImage);
    }

    const insertTrackQuery = `
        INSERT INTO track
            (${insertListString})
        VALUES
            (${insertIndicesString})
    `;

    const insertTrackRes = await db.query(insertTrackQuery, email, ...insertArgs);

    const { track_id : trackID } = insertTrackRes.rows[0];

    // Add the artist list to the database
    await _addArtistsToTrack(trackID, artists);

    return trackID;
};

export async function editTrack(trackID: number, newTitle?: string, newArtists?: string[], newCoverImage?: string, newRleaseDate?: string): Promise<void> {
    const dNow = new Date();

    const updateArgs = [];
    let updateListString = `update_date = $1`;

    let currParam = 2;

    if (newTitle) {
        updateListString += `, title = $${currParam}`;
        updateArgs.push(newTitle);
        currParam++;
    }

    if (newCoverImage) {
        updateListString += `, cover_image = $${currParam}`;
        updateArgs.push(newCoverImage);
        currParam++;
    }

    if (newRleaseDate) {
        const dReleaseDate = new Date(newRleaseDate);
        updateListString += `, release_date = $${currParam}`;
        updateArgs.push(dReleaseDate);
        currParam++;
    }

    let trackQuery = `
        UPDATE track AS t SET ${updateListString} WHERE t.track_id = $${currParam}
    `;

    const updateArtists = newArtists && newArtists.length > 0;

    // Check if no items are actually being updated
    if (updateArgs.length <= 0 && !updateArtists) {
        throw new Error("Error updating track, at least one field must be provided to update");
    }

    // Add the track query to the list of promises to run
    await db.query(trackQuery, dNow, ...updateArgs, trackID);

    // Make the update artists query, if needed
    if (newArtists && newArtists.length > 0) {
        // Remove the list of existing artists
        const removeArtistsListQuery = `
            DELETE FROM track_artist AS ta WHERE ta.track_id = $1;
        `;

        await db.query(removeArtistsListQuery, trackID);

        // Add in the new artist list
        await _addArtistsToTrack(trackID, newArtists);
    }
};

export async function deleteTrack(i_nTrackID: number): Promise<void> {
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

    await db.query(deleteQuery, i_nTrackID);
};