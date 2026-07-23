const User = require("../models/User");
// Email regex - checks for standard email format (something@something.something)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Password regex - at least 8 characters, one uppercase, one lowercase, one number, one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const register = async (req, res) => {
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
        const user = await User.create({
            email,
            password
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
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
        const user = await User.findOne({ email });
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
