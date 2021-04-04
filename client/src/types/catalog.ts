export type CatalogArtistType = "primary" | "featured" | "remix";

export interface CatalogArtist {
  artist: string;
  type: CatalogArtistType;
}

export interface CatalogItem {
  title: string;
  artists: CatalogArtist[];
}