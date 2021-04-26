import { Fingerprint } from "@/audio/types";
import {
  ArtistInput,
  CollaborationType,
  FingerprintInput,
} from "@/graphql-apollo.g.d";
import { CatalogArtist, CatalogCollaborationType } from "@/types/catalog";

export const toArtistInput = (artist: CatalogArtist): ArtistInput => {
  return {
    name: artist.name,
    type: toCatalogCollaborationType(artist.type),
  };
};

export const toCatalogCollaborationType = (
  type: CatalogCollaborationType
): CollaborationType => {
  if (type === "primary") return CollaborationType.Primary;
  else if (type === "featured") return CollaborationType.Featured;
  return CollaborationType.Remix;
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
