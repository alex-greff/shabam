export type CatalogArtistType = "primary" | "featured" | "remix";

export interface CatalogArtist {
  name: string;
  type: CatalogArtistType;
}

export interface CatalogItem {
  title: string;
  artists: CatalogArtist[];
}