const CatalogueOperations = require("./catalogue.operations");
const Utilities = require("../../../utilities");

const injectUserData = require("../../middleware/userData");
const permit = require("../../middleware/permission");


module.exports = {
    Query: {
        getAllTracks: Utilities.middlewareChain()(CatalogueOperations.getAllTracks),
        getTrack: Utilities.middlewareChain()(CatalogueOperations.getTrack),
    },
    Mutation: {
        addTrack: Utilities.middlewareChain(injectUserData, permit({}, "upload-track"))(CatalogueOperations.addTrack),
        editTrack: Utilities.middlewareChain(injectUserData, permit({}, "edit-track", "edit-owned-track"))(CatalogueOperations.editTrack),
        deleteTrack: Utilities.middlewareChain(injectUserData, permit({}, "delete-track", "delete-owned-track"))(CatalogueOperations.deleteTrack),
    }
};  