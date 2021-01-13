import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: "Credentials object for users."})
export class AccessCredentials {
  @Field({ description: "JWT access token."})
  access_token: string;
}