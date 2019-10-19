import CatalogueOperations from "./catalogue.operations";
import * as Utilities from "../../../utilities";

import injectUserData from "../../middleware/userData";
import permit from "../../middleware/permission";

// const CatalogueOperations = require("./catalogue.operations");
// const Utilities = require("../../../utilities");

// const injectUserData = require("../../middleware/userData");
// const permit = require("../../middleware/permission");


export default {
    Query: {
        getAllTracks: Utilities.middlewareChain()(CatalogueOperations.getAllTracks),
        getTrack: Utilities.middlewareChain()(CatalogueOperations.getTrack),
        searchTrack: Utilities.middlewareChain()(CatalogueOperations.searchTrack),
    },
    Mutation: {
        addTrack: Utilities.middlewareChain(injectUserData, permit({}, "upload-track"))(CatalogueOperations.addTrack),
        editTrack: Utilities.middlewareChain(injectUserData, permit({}, "edit-track", "edit-owned-track"))(CatalogueOperations.editTrack),
        deleteTrack: Utilities.middlewareChain(injectUserData, permit({}, "delete-track", "delete-owned-track"))(CatalogueOperations.deleteTrack),
        recomputeTrackFingerprint: Utilities.middlewareChain(injectUserData, permit({}, "edit-track", "edit-owned-track"))(CatalogueOperations.recomputeTrackFingerprint),
    },
    Track: {
        _id: track => track._id,
        metaData: track => track.metaData
    },
    TrackMetaData: {
        title: md => md.title,
        artists: md => md.artists,
        coverImage: md => md.coverImage,
        uploaderEmail: md => md.uploaderEmail,
        releaseDate: md => md.releaseDate,
        createdDate: md => md.createdDate,
        updatedDate: md => md.updatedDate
    }
};