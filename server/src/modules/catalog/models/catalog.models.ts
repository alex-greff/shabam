import { ArtistCollaboration } from '@/modules/artist/models/artist.models';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: "Metadata for a track." })
export class TrackMetadata {
  @Field()
  title: string;

  @Field(type => [ArtistCollaboration])
  artists: ArtistCollaboration[];

  @Field({ nullable: true })
  coverImage?: string;

  @Field(type => Int)
  duration: number;

  @Field(type => Int)
  numPlays: number;

  @Field({ nullable: true})
  releaseDate?: Date;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;
}

@ObjectType({ description: "A track object." })
export class Track {
  @Field(type => Int)
  id: number;

  @Field(type => Int)
  addressDatabase: number;

  @Field(type => TrackMetadata)
  metadata: TrackMetadata;
}

@ObjectType({ description: "A track candidate for a search. "})
export class SearchCandidate {
  @Field(type => Track)
  track: Track;

  @Field(type => Float)
  similarity: number;
}

@ObjectType({ description: "Search result for an audio search. "})
export class SearchResult { 
  @Field(type => [SearchCandidate])
  candidates: SearchCandidate[];
}