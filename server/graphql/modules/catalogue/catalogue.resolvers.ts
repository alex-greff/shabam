import { Track, TrackMetaData } from "../../../index";
import CatalogueOperations from "./catalogue.operations";
import * as Utilities from "../../../utilities";

import injectUserData from "../../middleware/userData";
import permit from "../../middleware/permission";

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
        _id: (track: Track) => track._id,
        metaData: (track: Track) => track.metaData
    },
    TrackMetaData: {
        title: (md: TrackMetaData) => md.title,
        artists: (md: TrackMetaData) => md.artists,
        coverImage: (md: TrackMetaData) => md.coverImage,
        uploaderEmail: (md: TrackMetaData) => md.uploaderEmail,
        releaseDate: (md: TrackMetaData) => md.releaseDate,
        createdDate: (md: TrackMetaData) => md.createdDate,
        updatedDate: (md: TrackMetaData) => md.updatedDate
    }
};