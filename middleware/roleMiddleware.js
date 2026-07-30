const roleMiddleware = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User."
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access Forbidden."
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Role Verification Failed."
            });

        }

    };

};

module.exports = roleMiddleware;    //role middleware