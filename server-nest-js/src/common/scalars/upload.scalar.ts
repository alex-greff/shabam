import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';

// Reference: 
// https://stackoverflow.com/questions/56097187/nestjs-apollo-graphql-upload-scalar
// https://vortac.io/2020/05/09/uploading-files-with-nestjs-and-graphql/
@Scalar("Upload")
export class UploadScalar implements CustomScalar<any, any> {
  description = "File upload scalar type";

  parseValue(value: any) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast: ValueNode, variables): any {
    return GraphQLUpload.parseLiteral(ast, variables);
  }
}