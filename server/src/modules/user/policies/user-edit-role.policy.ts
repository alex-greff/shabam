import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { Action, PolicyHandlerCallback } from '@/modules/policies/policy.types';

export const UserEditRolePolicy: PolicyHandlerCallback = (ability, context) => 
  ability.can(Action.Update, UserAccountEntity, 'role');
