import { AppAbility } from '@/modules/policies/policy.types';
import { ConfigurablePolicyHandler } from '@/modules/policies/ConfigurablePolicyHandler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as Utilities from '@/utilities';
import { UserService } from '../user.service';
import { UserAccountEntity } from '@/entities/UserAccount.entity';

export interface MutateUserPolicyHandlerConfig {
  targetUsernamePath: string;
}

const DEFAULT_CONFIG: MutateUserPolicyHandlerConfig = {
  targetUsernamePath: 'username',
};

@Injectable()
export abstract class MutateUserPolicyHandler extends ConfigurablePolicyHandler<MutateUserPolicyHandlerConfig> {
  constructor(
    readonly reflector: Reflector,
    private readonly userService: UserService,
    configKey: string,
  ) {
    super(reflector, configKey, DEFAULT_CONFIG);
  }

  protected abstract handleUserAccount(
    ability: AppAbility,
    currentUser: UserAccountEntity,
    targetUser: UserAccountEntity,
  ): boolean | Promise<boolean>;

  async handle(
    ability: AppAbility,
    currentUser: UserAccountEntity,
    context: ExecutionContext,
  ) {
    const config = this.getConfig(context);

    const ctx = GqlExecutionContext.create(context);

    const targetUsername = Utilities.getIn(
      ctx.getArgs(),
      config.targetUsernamePath,
    );
    if (!targetUsername) return false;

    const targetUser = await this.userService.findUser(targetUsername);
    if (!targetUser) return false;

    return this.handleUserAccount(ability, currentUser, targetUser);
  }
}
