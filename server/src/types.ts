import { ExecutionContext } from '@nestjs/common';
import { UserRoles } from './modules/policies/policy.types';

export interface JWTPayload {
  username: string;
  role: UserRoles;
}

export interface PermissionConfig {
  usernamePath: string;
}

export type CustomRoleCheckFunction = (
  context: ExecutionContext,
  config: PermissionConfig,
) => boolean | Promise<boolean>;

export interface RoleSchema {
  [role: string]: {
    can: string[];
    inherits?: string[];
  }
}
