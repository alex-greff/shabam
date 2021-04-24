import { ArgsType, Field, InputType, Int,  } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class TracksFilterInput {
  @Field(type => String, { nullable: true })
  uploader?: string;
}

@ArgsType()
export class GetTracksArgs {
  @Field(type => Int)
  @Min(0)
  offset = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(type => TracksFilterInput, { nullable: true })
  filter?: TracksFilterInput;
}
