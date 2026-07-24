const User = require("../models/User");
const Role = require("../models/role");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required"
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const namePart = email.split("@")[0];
        const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const roleName = role.trim().toLowerCase();

        // Validate role name against the known roles in ROLE_PERMISSIONS
        if (!Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, roleName)) {
            return res.status(400).json({
                message: `Invalid role. Must be one of: ${Object.keys(ROLE_PERMISSIONS).join(", ")}`
            });
        }

        // Always keep permissions in sync with ROLE_PERMISSIONS,
        // whether the role doc is new or already exists in the DB.
        const roleDoc = await Role.findOneAndUpdate(
            { name: roleName },
            { $set: { permissions: ROLE_PERMISSIONS[roleName] } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        console.log("Role document (synced):", roleDoc);

        const user = await User.create({
            name,
            email,
            password,
            role: roleDoc.name
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "Email not found"
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }
        return res.status(200).json({
            message: "Login Successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error("getAllUsers error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    register,
    login,
    getAllUsers
};