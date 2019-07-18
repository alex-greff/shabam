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
        const { title, artists, coverImage, releaseDate } = trackData;
        const { email } = context.userData;
        const fingerprintData = {"some":"json data"}; // TODO: generate fingerprint from worker

        await helpers.addTrack(title, artists, coverImage, releaseDate, email, fingerprintData);

        // Get the track that was just added
        const trackID = await helpers.findTrackID(title, artists);
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    editTrack: async (root, { trackData }, context) => {
        // TODO: implement
        return {
            _id: 123,
            fingerprintData: "something",
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
    deleteTrack: async (root, { title, artists }, context) => {
        // TODO: implement
        return true;
    }
};