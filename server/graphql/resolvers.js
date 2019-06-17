module.exports = {
    getAllTracks(args, req) {
        return [
            {
                title: "temp",
                artists: ["artist1", "artist2"],
                coverImage: "some image link",
                releaseDate: "some date",
                createdDate: "some date",
                updatedDate: "some date"
            }
        ]
    },
    getTrack({ trackID }, req) {
        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    },
    addTrack({ trackData }, req) {
        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    },
    editTrack({ trackData }, req) {
        return {
            title: "temp",
            artists: ["artist1", "artist2"],
            coverImage: "some image link",
            releaseDate: "some date",
            createdDate: "some date",
            updatedDate: "some date"
        }
    },
    deleteTrack({ trackID }, req) {
        return true;
    }
}