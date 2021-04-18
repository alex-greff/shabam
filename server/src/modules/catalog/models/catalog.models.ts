import { Field, ID, Int, ObjectType, Float, registerEnumType } from '@nestjs/graphql';

export enum ArtistType {
  PRIMARY = 0,
  FEATURED = 1,
  REMIX = 2
}

registerEnumType(ArtistType, {
  name: 'ArtistType',
});


@ObjectType({ description: "An artist." })
export class Artist {
  @Field()
  name: string;

  @Field(type => ArtistType)
  type: ArtistType;
}

@ObjectType({ description: "Metadata for a track." })
export class TrackMetadata {
  @Field()
  title: string;

  @Field(type => [Artist])
  artists: Artist[];

  @Field({ nullable: true })
  coverImage?: string;

  @Field({ nullable: true})
  releaseDate?: Date;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;
}

@ObjectType({ description: "A track object." })
export class Track {
  @Field(type => ID)
  id: string;

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