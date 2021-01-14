import { PermissionConfig } from "@/types";

export const DEFAULT_PORT = 5000;

// TODO: remove
export const SESSION_EXPIRE_LENGTH = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds
export const USERNAME_COOKIE_NAME = "username";

export const JWT_EXPIRE_TIME = "7d";

export const PERMISSIONS_METADATA_KEY = "permissions";
export const PERMISSIONS_CONFIG_KEY = "permissions-config";
export const CHECK_POLICIES_KEY = "check-policies";

export const DEFAULT_PERMISSION_CONFIG: PermissionConfig = {
  usernamePath: "username"
};