import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "Search result for an audio search. "})
export class SearchResult { 
  // TODO: implement
  @Field()
  something: string;
}