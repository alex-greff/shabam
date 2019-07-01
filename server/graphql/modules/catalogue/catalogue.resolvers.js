const CatalogueOperations = require("./catalogue.operations");
const GraphQLUtilities = require("../../utilities");

module.exports = {
    Query: {
        getAllTracks: GraphQLUtilities.middlewareChain()(CatalogueOperations.getAllTracks),
        getTrack: GraphQLUtilities.middlewareChain()(CatalogueOperations.getTrack),
    },
    Mutation: {
        addTrack: GraphQLUtilities.middlewareChain()(CatalogueOperations.addTrack),
        editTrack: GraphQLUtilities.middlewareChain()(CatalogueOperations.editTrack),
        deleteTrack: GraphQLUtilities.middlewareChain()(CatalogueOperations.deleteTrack),
    }
};  