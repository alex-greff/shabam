const axios = require("axios");
const db = require("../../../db");
const helpers = require("./catalogue.helpers");

// TODO: implement
module.exports = {
    getAllTracks: async (root, args, context) => {
        const allTracks = await helpers.getAllTracks();

        return allTracks;
    },
    getTrack: async (root, { title, artists }, context) => {
        // const res = await axios.post("http://fingerprint_worker:5001/generate_fingerprint");
        // console.log("RES", res.data);

        const trackID = await helpers.findTrackID(title, artists);
        const trackData = await helpers.getTrack(trackID);

        return trackData;
    },
    addTrack: async (root, { trackData }, context) => {
        const { title, artists, coverImage, releaseDate } = trackData; // TODO: get signal data
        const { email } = context.userData;
        const fingerprintData = {"some":"json data"}; // TODO: generate fingerprint from worker with signal data

        await helpers.addTrack(title, artists, coverImage, releaseDate, email, fingerprintData);

        // Get the track that was just added
        const trackID = await helpers.findTrackID(title, artists);
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    editTrack: async (root, { title, artists, updatedTrackData }, context) => {
        const { title: newTitle, artists: newArtists, 
            coverImage: newCoverImage, releaseDate: newReleaseDate } = updatedTrackData; // TODO: get updated signal data

        let newFingerprintData; // TODO: generate new fingerprint, if needed

        const trackID = await helpers.findTrackID(title, artists);

        // Update the track
        await helpers.editTrack(trackID, newTitle, newArtists, newCoverImage, newReleaseDate, newFingerprintData);

        // Get the updated track
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    deleteTrack: async (root, { title, artists }, context) => {
        const trackID = await helpers.findTrackID(title, artists);
        await helpers.deleteTrack(trackID);

        return true;
    }
};