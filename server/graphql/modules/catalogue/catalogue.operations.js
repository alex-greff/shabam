const helpers = require("./catalogue.helpers");
const workers = require("../../../workers");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const stream = require("stream");
const { FingerprintUtilities } = require("../../../utilities");

module.exports = {
    getAllTracks: async (root, args, context) => {
        const allTracks = await helpers.getAllTracks();

        return allTracks;
    },
    getTrack: async (root, { title, artists }, context) => {
        const trackID = await helpers.findTrackID(title, artists);
        const trackData = await helpers.getTrack(trackID);

        return trackData;
    },
    searchTrack: async (root, { fingerprint, fingerprintInfo }, context) => {
        // TODO: implement
        const fingerprintRes = await fingerprint;

        const { filename, mimetype, createReadStream } = await fingerprint;

        const fingerprintBuffer = await FingerprintUtilities.getFingerprintBuffer(createReadStream);
        let fingerprintData = FingerprintUtilities.getFingerprintData(fingerprintBuffer);

        // TODO: remove
        console.log("Fingerprint Buffer", fingerprintBuffer);
        console.log("Fingerprint Data", fingerprintData);

        // TODO: remove
        // Writes to a test file
        // NOTE: make sure "temp" directory exists
        // const writeStream = fs.createWriteStream("./temp/something");
        // fingerprintReadStream.pipe(writeStream);

        // TODO: remove
        // Writes to a test file
        // NOTE: make sure "temp" directory exists
        // const writeStream = fs.createWriteStream("./temp/test.wav");
        // audioReadStream.pipe(writeStream);

        // TODO: remove
        // const fd = new FormData();
        // fd.append("audioFile", audioReadStream, filename);

        // const res = await axios.post("http://fingerprint_worker:5001/generate_fingerprint", fd, {
        //     headers: { ...fd.getHeaders() }
        // });

        // console.log("FINGERPRINT WORKER RES", res.data);

        // TODO: send fingerprintReadStream to the identification worker

        return null;
    },
    addTrack: async (root, { trackData }, context) => {
        const { title, artists, coverImage, releaseDate } = trackData; // TODO: get signal data
        const { email } = context.userData;
        const fingerprintData = await workers.fingerprintWorker.generateFingerprint({}); // TODO: pass in signal data

        await helpers.addTrack(title, artists, coverImage, releaseDate, email, fingerprintData);

        // Get the track that was just added
        const trackID = await helpers.findTrackID(title, artists);
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    editTrack: async (root, { title, artists, updatedTrackData }, context) => {
        const { title: newTitle, artists: newArtists, 
            coverImage: newCoverImage, releaseDate: newReleaseDate } = updatedTrackData; // TODO: get updated signal data

        let newFingerprintData;
        // Generate a new fingerprint, if needed
        const generateNewFingerprint = false; // TODO: check if new signal data is passed in
        if (generateNewFingerprint) {
            newFingerprintData = await workers.fingerprintWorker.generateFingerprint({}); // TODO: pass in updated signal data
        }

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