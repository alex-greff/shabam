import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { FileUpload } from "graphql-upload";
import { GraphQLUpload } from "apollo-server-express";
import { FingerprintInput } from '@/modules/fingerprint/dto/fingerprint.inputs';
import { Artist, ArtistType } from '../models/catalog.models';

@InputType({ description: "An artist input." })
export class ArtistInput {
  @Field()
  name: string;

  @Field(type => ArtistType)
  type: ArtistType;
}

@InputType({ description: 'Input data for adding a new track.' })
export class TrackAddDataInput {
  @Field()
  title: string;

  @Field(type => [ArtistInput])
  artists: ArtistInput[];

  @Field({ nullable: true })
  @IsOptional()
  releaseDate?: Date;

  @Field(type => FingerprintInput)
  fingerprint: FingerprintInput;

  @Field(type => GraphQLUpload, { nullable: true })
  @IsOptional()
  coverArt: Promise<FileUpload>;
}

@InputType({ description: 'Input data for editing a track.' })
export class TrackEditDataInput {
  @Field({ nullable: true })
  @IsOptional()
  title: string;

  @Field(type => [String], { nullable: true })
  @IsOptional()
  artists: string[];

  @Field({ nullable: true })
  @IsOptional()
  coverImage: string;

  @Field({ nullable: true })
  @IsOptional()
  releaseDate: Date;
}

// TODO: remove
// @InputType({
//   description: 'Supporting information for the raw fingerprint data.',
// })
// export class FingerprintInfoInput {
//   @Field((type) => Int)
//   windowAmount: number;

//   @Field((type) => Int)
//   partitionAmount: number;
// }
