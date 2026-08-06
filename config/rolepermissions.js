const ROLE_PERMISSIONS = {
    admin: [
        "dashboard",
        "user",
        "role",
        "department",
        "designation",
        "employee",
        "attendance",
        "payroll",
        "notice",
        "settings",
        "leave"
    ],
    hr: [
       "dashboard",
        "profile",
        "department",
        "designation",
        "attendance",
        "notice",
        "leave",
        "payroll"
    ],
    manager: [
       "dashboard",
        "profile",
        "department",
        "designation",
        "attendance",
        "notice",
        "leave",
        "payroll"
    ],
    employee: [
        "dashboard",
        "profile",
        "department",
        "designation",
        "attendance",
        "notice",
        "leave",
        "payroll"
    ]
};
module.exports = ROLE_PERMISSIONS;
// Helper to compute allowed role name variants for a given permission
module.exports.getAllowedRoleVariants = function (permission) {
    const roles = Object.keys(ROLE_PERMISSIONS).filter((r) => Array.isArray(ROLE_PERMISSIONS[r]) && ROLE_PERMISSIONS[r].includes(permission));
    const variants = new Set();
    roles.forEach((r) => {
        variants.add(r); // lowercase as defined
        variants.add(r.toLowerCase());
        variants.add(r.toUpperCase());
        variants.add(r.charAt(0).toUpperCase() + r.slice(1));
    });
    return Array.from(variants);
};