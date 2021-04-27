import { ArtistCollaboration } from '@/modules/artist/models/artist.models';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

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

// TODO: remove
// @ObjectType({ description: "A possible search result." })
// export class TrackSearchResult {
//   @Field(type => Track)
//   track: Track;

//   @Field(type => Float)
//   similarity: number;
// }