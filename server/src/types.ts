import { ExecutionContext } from '@nestjs/common';
import { UserRole } from './modules/policies/policy.types';

export interface UserRequestData {
  username: string;
  role: UserRole;
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