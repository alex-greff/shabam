// TODO: implement
module.exports = {
    getAllTracks(root, args, context) {
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
    getTrack(root, { trackID }, context) {
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
    addTrack(root, { trackData }, context) {
        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    },
    editTrack(root, { trackData }, context) {
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