const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const SALT_ROUNDS = 10;

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password, and role are required"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const normalizedRole = typeof role === "string" ? role.toLowerCase() : role;
        const roleDoc = await Role.findOne({ name: normalizedRole });

        if (!roleDoc) {
            return res.status(400).json({
                success: false,
                message: `Role '${role}' does not exist`
            });
        }

        // One-way hash. There is no function to reverse this — that's the point.
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: roleDoc._id
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: roleDoc.name
            }
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const login = async (req, res) => {
    try {
        console.log("========== LOGIN REQUEST ==========");
        console.log("Request Body:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ email })
            .select("+password")
            .populate("role");

        console.log("User Found:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        if (!user.role) {
            console.log("Role is missing for this user.");

            return res.status(500).json({
                success: false,
                message: "User role not found."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: user.role.name
        });

        console.log("Token Generated Successfully");

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name
            }
        });

    } catch (error) {

        console.error("========== LOGIN ERROR ==========");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").populate("role");
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

const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("role");

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("getUserById error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateUser = async (req, res) => {
    try {

        const { name, email, role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        if (!name) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!role) {
            return res.status(400).json({
                message: "Role is required"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        const roleDoc = await Role.findOne({ name: role });

        if (!roleDoc) {
            return res.status(400).json({
                message: `Role '${role}' does not exist`
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                role: roleDoc._id
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("role");

        return res.status(200).json({
            message: "User Updated Successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("updateUser error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "User Deleted Successfully"
        });

    } catch (error) {
        console.error("deleteUser error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Admin can trigger a reset instead of ever viewing/recovering the original
// password (which is impossible now anyway, since bcrypt hashes are one-way).
const resetUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || !passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "A valid new password is required (min 8 chars, upper/lower/number/special char)"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("resetUserPassword error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    resetUserPassword
};