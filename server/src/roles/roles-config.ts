import { CheckUserIsSelf } from "@/modules/user/role-checks/user.role-checks";
import { RoleSchema } from "@/types";
import { CustomRoleCheckMappings } from "./roles.types";

export const roles: RoleSchema = {
  admin: {
    can: [
      "edit-user",
      "edit-user-roles",
      "delete-user",
      "edit-track",
      "delete-track",
    ],
    inherits: ["distributor"],
  },
  distributor: {
    // TODO: "edit-owned-track", "delete-owned-track" needs its own Track guard
    can: ["upload-track", "edit-owned-track", "delete-owned-track"],
    inherits: ["default"],
  },
  default: {
    can: ['edit-self', 'delete-self'],
  },
};

export const customRoleChecks: CustomRoleCheckMappings = {
  "edit-self": CheckUserIsSelf,
  "delete-self": CheckUserIsSelf
};