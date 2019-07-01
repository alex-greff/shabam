const CatalogueOperations = require("./catalogue.operations");
const Utilities = require("../../utilities");

module.exports = {
    Query: {
        getAllTracks: Utilities.middlewareChain()(CatalogueOperations.getAllTracks),
        getTrack: Utilities.middlewareChain()(CatalogueOperations.getTrack),
    },
    Mutation: {
        addTrack: Utilities.middlewareChain()(CatalogueOperations.addTrack),
        editTrack: Utilities.middlewareChain()(CatalogueOperations.editTrack),
        deleteTrack: Utilities.middlewareChain()(CatalogueOperations.deleteTrack),
    }
};  