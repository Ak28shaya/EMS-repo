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
        "notice"
    ],
    HR: [
        "dashboard",
        "department",
        "designation",
        "employee",
        "attendance",
        "payroll",
        "notice"
    ],
    manager: [
        "dashboard",
        "employee",
        "attendance",
        "notice"
    ],
    employee: [
        "dashboard",
        "profile",
        "attendance"
    ]
};
module.exports = ROLE_PERMISSIONS;