import { Fingerprint } from "@/audio/types";
import {
  ArtistInput,
  CollaborationType,
  FingerprintInput,
  Track,
} from "@/graphql-apollo.g.d";
import {
  CatalogArtist,
  CatalogCollaborationType,
  CatalogItemDisplayData,
} from "@/types/catalog";

export const toArtistInput = (artist: CatalogArtist): ArtistInput => {
  return {
    name: artist.name,
    type: toCollaborationType(artist.type),
  };
};

export const toCollaborationType = (
  type: CatalogCollaborationType
): CollaborationType => {
  if (type === "primary") return CollaborationType.Primary;
  else if (type === "featured") return CollaborationType.Featured;
  return CollaborationType.Remix;
};

export const toCatalogCollaborationType = (
  type: CollaborationType
): CatalogCollaborationType => {
  if (type === CollaborationType.Primary) return "primary";
  else if (type === CollaborationType.Featured) return "featured";
  else return "remix";
};

export const toFingerprintInput = (
  fingerprint: Fingerprint
): FingerprintInput => {
  // Convert fingerprint data typed array to binary data blob
  const dataBin = new Blob([fingerprint.data], { type: "octet/stream" });

  return {
    numberOfPartitions: fingerprint.numberOfPartitions,
    numberOfWindows: fingerprint.numberOfWindows,
    fingerprintData: dataBin,
  };
};

export const trackToCatalogItemDisplayData = (
  track: Track
): CatalogItemDisplayData => {
  const trackItem: CatalogItemDisplayData = {
    id: track.id,
    title: track.metadata.title,
    duration: track.metadata.duration,
    plays: track.metadata.numPlays,
    coverArtSrc: track.metadata.coverImage ?? undefined,
    artists: track.metadata.artists.map((artist) => {
      return {
        name: artist.name,
        type: toCatalogCollaborationType(artist.type),
      };
    }),
  };
  return trackItem;
};
