const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. Token not provided."
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);
        const userId = decoded._id || decoded.userId;
        const user = await User.findById(userId).populate("role");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired Token."
            });
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role?.name || "",
            permissions: Array.isArray(user.permissions) ? user.permissions : [],
            rolePermissions: Array.isArray(user.role?.permissions) ? user.role.permissions : []
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token."
        });

    }
};

module.exports = authMiddleware;