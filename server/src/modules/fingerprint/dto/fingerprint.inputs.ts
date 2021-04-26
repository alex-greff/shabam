import { Field, InputType, Int } from "@nestjs/graphql";
import { FileUpload } from "graphql-upload";
import { GraphQLUpload } from "apollo-server-express";

@InputType({ description: "Input data for searching. "})
export class FingerprintInput {
  @Field(type => Int)
  numberOfWindows: number;

  @Field(type => Int)
  numberOfPartitions: number;

  @Field(type => GraphQLUpload!)
  fingerprintData: Promise<FileUpload>;
}