import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: "A user object. "})
export class User {
  @Field(type => ID, { description: "The ID of the user in the database."})
  id: string;

  @Field({ description: "The username of the user."})
  username: string;

  @Field({ description: "The salted hashed password of the user."})
  password: string;
}