const User = require("../models/User");
const Role = require("../models/Role");

const { encryptPassword, decryptPassword } = require("../config/crypto");
const { generateToken } = require("../config/jwt");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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

        const roleDoc = await Role.findOne({ name: role });

        if (!roleDoc) {
            return res.status(400).json({
                success: false,
                message: `Role '${role}' does not exist`
            });
        }

        const encryptedPassword = encryptPassword(password);

        const user = await User.create({
            name,
            email,
            password: encryptedPassword,
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

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const user = await User.findOne({ email })
            .select("+password")
            .populate("role");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        let decryptedPassword;

try {
    decryptedPassword = decryptPassword(user.password);
} catch (error) {
    return res.status(500).json({
        success: false,
        message: "Password Decryption Failed"
    });
}

        if (decryptedPassword !== password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = generateToken({
            _id: user._id,
            employeeId: user.employeeId || null,
            email: user.email,
            role: user.role.name
        });

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

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
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
const getUserPassword = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const originalPassword = decryptPassword(user.password);

        return res.status(200).json({
            success: true,
            email: user.email,
            password: originalPassword
        });

    } catch (error) {

        console.error(error);

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
    getUserPassword
};