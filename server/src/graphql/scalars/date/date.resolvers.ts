import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

export default {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value: Date) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value);
      }
      return null;
    },
  }),
};
