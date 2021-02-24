import { Action, AppAbility } from '@/modules/policies/policy.types';
import { Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';
import {
  MutateUserPolicyHandler,
  MutateUserPolicyHandlerConfig,
} from './MutateUserPolicyHandler';
import { UserAccountEntity } from '@/entities/UserAccount.entity';

const CONFIG_KEY = 'USER_EDIT_ROLE_POLICY_CONFIG_KEY';

@Injectable()
export class UserEditRolePolicy extends MutateUserPolicyHandler {
  constructor(readonly reflector: Reflector, userService: UserService) {
    super(reflector, userService, CONFIG_KEY);
  }

  static configure(config: Partial<MutateUserPolicyHandlerConfig>) {
    return SetMetadata(CONFIG_KEY, config);
  }

  handleUserAccount(
    ability: AppAbility,
    currentUser: UserAccountEntity,
    targetUser: UserAccountEntity,
  ) {
    return ability.can(currentUser, Action.Update, targetUser, "role");
  }
}
