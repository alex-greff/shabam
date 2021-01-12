import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
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

@InputType()
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

@InputType() 
export class FingerprintInfoInput {
  @Field(type => Int)
  windowAmount: number;

  @Field(type => Int)
  partitionAmount: number;
}