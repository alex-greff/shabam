const CatalogueOperations = require("./catalogue.operations");
const Utilities = require("../../../utilities");
const permit = require("../../middleware/permission");

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