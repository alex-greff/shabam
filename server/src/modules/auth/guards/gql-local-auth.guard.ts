import { Injectable, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import * as Utilities from '@/utilities';

const CONFIG_KEY = 'GQL_LOCAL_AUTH_CONFIG_KEY';

export interface GqlLocalAuthGuardConfig {
  usernamePath: string;
  passwordPath: string;
}

const DEFAULT_CONFIG: GqlLocalAuthGuardConfig = {
  usernamePath: 'username',
  passwordPath: 'password',
};

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  static configure(config: Partial<GqlLocalAuthGuardConfig>) {
    return SetMetadata(CONFIG_KEY, config);
  }

  private getConfig(context: ExecutionContext) {
    let config = this.reflector.get<GqlLocalAuthGuardConfig>(
      CONFIG_KEY,
      context.getHandler(),
    );
    config = config ? { ...DEFAULT_CONFIG, ...config } : DEFAULT_CONFIG;

    return config;
  }

  private constructRequestBody(context: ExecutionContext) {
    const config = this.getConfig(context);

    // Create fake execution environment in order to work with GraphQL
    // References:
    // https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
    // https://stackoverflow.com/questions/55269777/nestjs-get-current-user-in-graphql-resolver-authenticated-with-jwt
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    const args = ctx.getArgs();
    // Injects the email and password arguments into the body so that
    // passport-local finds them
    // Reference: https://github.com/3logy/nestjs-graphql-passport
    request.body = {
      // We use username here b/c that's what passport-local searches for
      username: Utilities.getIn(args, config.usernamePath),
      password: Utilities.getIn(args, config.passwordPath),
    };
    return request;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    this.constructRequestBody(context);
    return true;
  }

  getRequest(context: ExecutionContext) {
    return this.constructRequestBody(context);
  }
}