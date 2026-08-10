const { verifyToken } = require("../config/jwt");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Profile = require("../models/profile");

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
        let employeeIdFromToken = decoded.employeeId || decoded.empId || null;
        const user = await User.findById(userId).populate("role");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired Token."
            });
        }

        if (!employeeIdFromToken) {
            let employee = await Employee.findOne({ email: user.email });
            if (!employee) {
                const profile = await Profile.findOne({ createdBy: user._id });
                if (profile?.employeeId) {
                    employee = await Employee.findOne({ employeeId: profile.employeeId });
                }
            }
            if (employee) {
                employeeIdFromToken = employee._id;
            }
        }

        req.user = {
            id: user._id,
            _id: user._id,
            userId: user._id,
            employeeId: employeeIdFromToken,
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