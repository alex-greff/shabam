import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { Action, AppAbility } from '@/modules/policies/policy.types';
import { ConfigurablePolicyHandler } from '@/modules/policies/ConfigurablePolicyHandler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../user.service';
import * as Utilities from '@/utilities';

export interface UserEditRolePolicyConfig {
  targetUsernamePath: string;
}

const CONFIG_KEY = 'USER_EDIT_ROLE_POLICY_CONFIG_KEY';

const DEFAULT_CONFIG: UserEditRolePolicyConfig = {
  targetUsernamePath: 'username',
};

@Injectable()
export class UserEditRolePolicy extends ConfigurablePolicyHandler<UserEditRolePolicyConfig> {
  constructor(
    readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {
    super(reflector, CONFIG_KEY, DEFAULT_CONFIG);
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

    const result = ability.can(Action.Update, UserAccountEntity, 'role');

    return result;
  }
}
