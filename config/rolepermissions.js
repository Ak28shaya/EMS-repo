// Default permissions for known role types
const ROLE_PERMISSIONS = {
  admin: ["add_user", "delete_user", "view_user", "edit_user"],
  manager: ["view_user"],
  employee: []
};

module.exports = ROLE_PERMISSIONS;