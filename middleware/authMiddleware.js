const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
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

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token."
        });

    }
};

module.exports = authMiddleware; // authmiddleware