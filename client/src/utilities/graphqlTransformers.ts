import { Fingerprint } from "@/audio/types";
import {
  ArtistInput,
  ArtistType,
  FingerprintInput,
} from "@/graphql-apollo.g.d";
import { CatalogArtist, CatalogArtistType } from "@/types/catalog";

export const toArtistInput = (artist: CatalogArtist): ArtistInput => {
  return {
    name: artist.name,
    type: toCatalogArtistType(artist.type),
  };
};

export const toCatalogArtistType = (type: CatalogArtistType): ArtistType => {
  if (type === "primary") return ArtistType.Primary;
  else if (type === "featured") return ArtistType.Featured;
  return ArtistType.Remix;
};

export const toFingerprintInput = (
  fingerprint: Fingerprint
): FingerprintInput => {
  // Convert fingerprint data typed array to binary data blob
  const dataBin = new Blob([fingerprint.data], { type: "octet/stream" });

  return {
    frequencyBinCount: fingerprint.frequencyBinCount,
    numberOfWindows: fingerprint.numberOfWindows,
    fingerprintData: dataBin,
  };
};
