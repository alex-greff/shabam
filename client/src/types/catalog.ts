export type CatalogCollaborationType = "primary" | "featured" | "remix";

export interface CatalogArtist {
  name: string;
  type: CatalogCollaborationType;
}

export interface CatalogItem {
  title: string;
  artists: CatalogArtist[];
}

export interface CatalogItemDisplayData {
  title: string;
  artists: CatalogArtist[];
  duration: number; // milliseconds
  plays: number; // integer
  coverArtSrc?: string;
}