import { Field, InputType } from '@nestjs/graphql';
import { CollaborationType } from '../models/artist.models';

@InputType({ description: "An artist input." })
export class ArtistInput {
  @Field()
  name: string;

  @Field(type => CollaborationType)
  type: CollaborationType;
}