import { createParamDecorator } from '@nestjs/common';

// Reference:
// https://stackoverflow.com/questions/55269777/nestjs-get-current-user-in-graphql-resolver-authenticated-with-jwt

export const CurrentUser = createParamDecorator(
  (data, req) => req.user,
);