import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: "Metadata for a track." })
export class TrackMetadata {
  @Field()
  title: string;

  @Field(type => [String])
  artists: string[];

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