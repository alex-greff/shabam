import { Track, TrackMetaData } from "@/types/schema";
import CatalogueOperations from "./catalogue.operations";
import permit from "@/graphql/middleware/permission";
import * as Utilities from "@/utilities";

export default {
  Query: {
    getAllTracks: Utilities.middlewareChain()(CatalogueOperations.getAllTracks),
    getTrack: Utilities.middlewareChain()(CatalogueOperations.getTrack),
    searchTrack: Utilities.middlewareChain()(CatalogueOperations.searchTrack),
  },
  Mutation: {
    addTrack: Utilities.middlewareChain(permit({}, "upload-track"))(
      CatalogueOperations.addTrack
    ),
    editTrack: Utilities.middlewareChain(
      permit({}, "edit-track", "edit-owned-track")
    )(CatalogueOperations.editTrack),
    deleteTrack: Utilities.middlewareChain(
      permit({}, "delete-track", "delete-owned-track")
    )(CatalogueOperations.deleteTrack),
    recomputeTrackFingerprint: Utilities.middlewareChain(
      permit({}, "edit-track", "edit-owned-track")
    )(CatalogueOperations.recomputeTrackFingerprint),
  },
  Track: {
    _id: (track: Track) => track._id,
    metaData: (track: Track) => track.metaData,
  },
  TrackMetaData: {
    title: (md: TrackMetaData) => md.title,
    artists: (md: TrackMetaData) => md.artists,
    coverImage: (md: TrackMetaData) => md.coverImage,
    uploaderUsername: (md: TrackMetaData) => md.uploaderUsername,
    releaseDate: (md: TrackMetaData) => md.releaseDate,
    createdDate: (md: TrackMetaData) => md.createdDate,
    updatedDate: (md: TrackMetaData) => md.updatedDate,
  },
};
