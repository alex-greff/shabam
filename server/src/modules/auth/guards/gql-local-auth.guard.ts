import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Create fake execution environment in order to work with GraphQL
    // References: 
    // https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
    // https://stackoverflow.com/questions/55269777/nestjs-get-current-user-in-graphql-resolver-authenticated-with-jwt
    await super.canActivate(context);
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    // Injects the username and password arguments into the body so that
    // passport-local finds them
    // Reference: https://github.com/3logy/nestjs-graphql-passport
    request.body = ctx.getArgs();
    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request  = ctx.getContext();
    request.body = ctx.getArgs();
    return request;
  }
}