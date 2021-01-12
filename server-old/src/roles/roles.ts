let roles: any = {
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
    can: ["upload-track", "edit-owned-track", "delete-owned-track"],
    inherits: ["default"],
  },
  default: {
    can: ["edit-self", "delete-self"],
  },
};

export default roles;
