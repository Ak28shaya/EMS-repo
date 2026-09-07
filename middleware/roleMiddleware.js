const ROLE_PERMISSIONS = require("../config/rolepermissions");
const { permissionMatchesModule } = require("../utils/rolePermissionUtils");

const roleMiddleware = (...allowedRoles) => {
    // Normalize roles passed from routes
    const normalizedAllowedRoles = allowedRoles
        .flat()
        .map((role) => String(role).trim().toLowerCase());

    return (req, res, next) => {
        try {
            // ---------------------------------------
            // 1. Check authentication
            // ---------------------------------------
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User.",
                });
            }

            // ---------------------------------------
            // 2. Get logged-in user's role
            // ---------------------------------------
            const userRole = String(req.user.role || "")
                .trim()
                .toLowerCase();

            // ---------------------------------------
            // 3. Direct role check
            // ---------------------------------------
            if (normalizedAllowedRoles.includes(userRole)) {
                return next();
            }

            // ---------------------------------------
            // 4. Get user's permissions from both explicit user permissions and role permissions
            // ---------------------------------------
            const rawPermissions = [
                ...(Array.isArray(req.user.permissions) ? req.user.permissions : []),
                ...(Array.isArray(req.user.rolePermissions) ? req.user.rolePermissions : []),
            ];
            const userPermissions = Array.from(
                new Set(
                    rawPermissions
                        .filter((permission) => permission != null)
                        .map((permission) => String(permission).trim().toLowerCase())
                )
            );

            // ---------------------------------------
            // 5. Check permission-based access
            // ---------------------------------------
            const hasPermission = userPermissions.some((permission) => {
                const permissionKey = String(permission).trim().toLowerCase();
                const moduleName = permissionKey.includes(":") ? permissionKey.split(":")[0] : permissionKey;

                const permittedRoles =
                    typeof ROLE_PERMISSIONS.getRolesForPermission === "function"
                        ? ROLE_PERMISSIONS
                              .getRolesForPermission(moduleName)
                              .map((role) =>
                                  String(role).trim().toLowerCase()
                              )
                        : [];

                return permittedRoles.some((role) =>
                    normalizedAllowedRoles.includes(role)
                ) || permissionMatchesModule(permissionKey, moduleName);
            });

            if (hasPermission) {
                return next();
            }

            // ---------------------------------------
            // 6. Access denied
            // ---------------------------------------
            return res.status(403).json({
                success: false,
                message: "Access Forbidden.",
            });
        } catch (error) {
            console.error("Role Middleware Error:", error);

            return res.status(500).json({
                success: false,
                message: "Role Verification Failed.",
            });
        }
    };
};

module.exports = roleMiddleware;