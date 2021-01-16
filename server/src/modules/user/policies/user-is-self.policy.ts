import { Action, AppAbility } from '@/modules/policies/policy.types';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigurablePolicyHandler } from '@/modules/policies/ConfigurablePolicyHandler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../user.service';
import * as Utilities from '@/utilities';

export interface UserIsSelfPolicyConfig {
  targetUsernamePath: string;
}

const CONFIG_KEY = 'USER_IS_SELF_POLICY_CONFIG_KEY';

const DEFAULT_CONFIG: UserIsSelfPolicyConfig = {
  targetUsernamePath: 'username',
};

@Injectable()
export class UserIsSelfPolicy extends ConfigurablePolicyHandler<UserIsSelfPolicyConfig> {
  constructor(
    readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {
    super(reflector, CONFIG_KEY, DEFAULT_CONFIG);
  }

  static configure(config: UserIsSelfPolicyConfig) {
    return SetMetadata(CONFIG_KEY, config);
  }

  async handle(ability: AppAbility, context: ExecutionContext) {
    const config = this.getConfig(context);

    const ctx = GqlExecutionContext.create(context);

    const targetUsername = Utilities.getIn(
      ctx.getArgs(),
      config.targetUsernamePath,
    );
    if (!targetUsername) return false;

    const targetUser = await this.userService.findUser(targetUsername);
    if (!targetUser) return false;

    const result = ability.can(Action.Update, targetUser);

    return result;
  }
}
