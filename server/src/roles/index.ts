import { roles } from '@/roles/roles-config';

export const canDoSomePermissions = (role: string, ...permissions: string[]) => {
  // Function checking if the given permission is allowed
  const canDoPermission = (role: string, permission: string) => {
    // Role does not exist, deny access
    if (!roles[role]) return false;

    const $role = roles[role];

    // The permission belongs to this role, grant access
    if ($role.can.includes(permission)) return true;

    // There are no inherited roles, deny access
    if (!$role.inherits || $role.inherits.length <= 0) return false;

    // Check if at least one of the inherited roles has this permission
    return $role.inherits.some((inheritedRole) =>
      canDoPermission(inheritedRole, permission),
    );
  };

  // Check if the role has some of the provided permissions
  return permissions.every((permission) => canDoPermission(role, permission));
};
