import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType({ description: 'Input data for adding a new track.' })
export class TrackAddDataInput {
  @Field()
  title: string;

  @Field(type => [String])
  artists: string[];

  @Field({ nullable: true })
  @IsOptional()
  coverImage: string;

  @Field({ nullable: true })
  @IsOptional()
  releaseDate: Date;
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
