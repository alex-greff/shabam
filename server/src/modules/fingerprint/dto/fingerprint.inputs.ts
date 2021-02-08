import { UploadScalar } from "@/common/scalars/upload.scalar";
import { Field, InputType, Int } from "@nestjs/graphql";
import { FileUpload } from "graphql-upload";

@InputType({ description: "Input data for searching. "})
export class FingerprintInput {
  @Field(type => Int)
  numberOfWindows: number;

  @Field(type => Int)
  frequencyBinCount: number;

  @Field(type => UploadScalar)
  fingerprintData: Promise<FileUpload>;
}