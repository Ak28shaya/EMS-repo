const User = require("../models/User");
const Employee = require("../models/Employee");
const Role = require("../models/Role");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");

const SALT_ROUNDS = 10;

const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return null;
  return email.trim().toLowerCase();
};

const resolveEmployeeIdForUser = async (user) => {
  if (!user) return null;
  const email = normalizeEmail(user.email);

  let employee = null;
  if (email) {
    employee = await Employee.findOne({ email });
  }

  if (!employee) {
    const profile = await Profile.findOne({ createdBy: user._id });
    if (profile?.employeeId) {
      employee = await Employee.findOne({ employeeId: profile.employeeId });
    }
  }

  return employee ? employee._id : null;
};

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const roleDoc = await Role.findOne({ name: role.toLowerCase() });

    if (!roleDoc) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id,
      permissions: roleDoc.permissions || [],
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Current User
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access."
      });
    }

    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const employeeId = await resolveEmployeeIdForUser(user);
    const sanitizedUser = { ...user.toObject() };
    if (employeeId) {
      sanitizedUser.employeeId = employeeId;
    }

    return res.status(200).json({
      success: true,
      user: sanitizedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    console.log("[authcontroller] login body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email })
      .select("+password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.role) {
      console.error("[authcontroller] login failed: missing role for user", {
        userId: user._id,
        email: user.email,
      });
      return res.status(500).json({
        message: "User role is not configured. Please contact the administrator.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    const employeeId = await resolveEmployeeIdForUser(user);

    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role.name,
      employeeId,
    });

    const sanitizedUser = { ...user.toObject() };
    delete sanitizedUser.password;
    if (employeeId) {
      sanitizedUser.employeeId = employeeId;
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: sanitizedUser,
    });

  } catch (error) {
    console.error("[authcontroller] login error:", error);
    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .populate("role");

    res.status(200).json({
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {

    const { name, email, role } = req.body;

    const roleDoc = await Role.findOne({
      name: role.toLowerCase(),
    });

    if (!roleDoc) {
      return res.status(404).json({
        message: "Role Not Found",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role: roleDoc._id,
        permissions: roleDoc.permissions || [],
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("role");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};