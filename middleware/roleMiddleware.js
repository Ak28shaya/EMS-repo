const ROLE_PERMISSIONS = require("../config/rolepermissions");

const roleMiddleware = (...allowedRoles) => {
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).trim().toLowerCase());

    return (req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User."
                });
            }

            const userRole = String(req.user.role || "").trim().toLowerCase();
            const userPermissions = Array.isArray(req.user.permissions)
                ? req.user.permissions.map((perm) => String(perm).trim().toLowerCase())
                : [];

            if (normalizedAllowedRoles.includes(userRole)) {
                return next();
            }

            const hasPermissionRole = userPermissions.some((permission) => {
                const permittedRoles = ROLE_PERMISSIONS.getRolesForPermission(permission.toLowerCase()).map((role) => role.toLowerCase());
                return permittedRoles.some((role) => normalizedAllowedRoles.includes(role));
            });

            if (hasPermissionRole) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: "Access Forbidden."
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Role Verification Failed."
            });

        }

    };

};

module.exports = roleMiddleware;    //role middleware