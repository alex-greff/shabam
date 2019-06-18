// TODO: implement
module.exports = {
    getAllTracks() {
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
    getTrack(trackID) {
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
    addTrack(trackData) {
        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    },
    editTrack(trackData) {
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