import { SetMetadata } from '@nestjs/common';
import * as Config from '@/config';
import { PermissionConfig } from '@/types';

/**
 * Sets up the roles for the current permission check.
 */
export const Permissions = (...roles: string[]) =>
  SetMetadata(Config.PERMISSIONS_METADATA_KEY, roles);

/**
 * Overrides the default config for the current permission check.
 */
export const PermissionsConfig = (config: Partial<PermissionConfig>) => 
  SetMetadata(Config.PERMISSIONS_CONFIG_KEY, config);