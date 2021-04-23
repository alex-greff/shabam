import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum CollaborationType {
  PRIMARY = 0,
  FEATURED = 1,
  REMIX = 2
}

registerEnumType(CollaborationType, {
  name: 'CollaborationType',
});

@ObjectType({ description: "An artist collaboration." })
export class ArtistCollaboration {
  @Field()
  name: string;

  @Field(type => CollaborationType)
  type: CollaborationType;
}