import { ArtistInput, CollaborationType } from "../graphql-request.g";

export function toArtistInput(
  primaryAuthors: string[] = [],
  featuredAuthors: string[] = [],
  remixAuthors: string[] = []
): ArtistInput[] {
  let artistInputs: ArtistInput[] = [];

  for (let primaryAuthor of primaryAuthors) {
    artistInputs.push({
      name: primaryAuthor,
      type: CollaborationType.Primary,
    });
  }

  for (let featuredAuthor of featuredAuthors) {
    artistInputs.push({
      name: featuredAuthor,
      type: CollaborationType.Featured,
    });
  }

  for (let remixAuthor of remixAuthors) {
    artistInputs.push({
      name: remixAuthor,
      type: CollaborationType.Remix,
    });
  }

  return artistInputs;
}
