import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, IPolicyHandler } from './policy.types';

/**
 * Base class for configurable policy handlers.
 * Note: extending classes are responsible for exposing a static configure
 * method to call SetMetadata to set the configuration values as a decorator.
 */
@Injectable()
export abstract class ConfigurablePolicyHandler<C> implements IPolicyHandler {
  constructor(
    protected reflector: Reflector,
    private configKey: string,
    private defaultConfig: C,
  ) {}

  protected getConfig(context: ExecutionContext) {
    let config = this.reflector.get<Partial<C>>(
      this.configKey,
      context.getHandler(),
    );
    config = config ? { ...this.defaultConfig, ...config } : this.defaultConfig;

    return config;
  }

  abstract handle(
    ability: AppAbility,
    user: UserAccountEntity,
    context: ExecutionContext,
  ): boolean | Promise<boolean>;
}
