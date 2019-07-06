const axios = require("axios");

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