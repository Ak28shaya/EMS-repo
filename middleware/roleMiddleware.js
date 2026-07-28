const roleMiddleware = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            // Check if user exists
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User."
                });
            }

            // Convert user role to lowercase
            const userRole = req.user.role.toLowerCase();

            // Convert allowed roles to lowercase
            const roles = allowedRoles.map(role => role.toLowerCase());

            // Check permission
            if (!roles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Access Forbidden."
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Role Verification Failed.",
                error: error.message
            });

        }

    };

};

module.exports = roleMiddleware;