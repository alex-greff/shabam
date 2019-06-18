const CatalogueOperations = require("./catalogue.operations");

module.exports = {
    Query: {
        getAllTracks: (root, args, context) => CatalogueOperations.getAllTracks(),
        getTrack: (root, { trackID }, context) => CatalogueOperations.getTrack(trackID),
    },
    Mutation: {
        addTrack: (root, { trackData }, context) => CatalogueOperations.addTrack(trackData),
        editTrack: (root, { trackData }, context) => CatalogueOperations.editTrack(trackData),
        deleteTrack: (root, { trackID }, context) => CatalogueOperations.deleteTrack(trackID),
    }
};  