const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserPassword
} = require("../controllers/authcontroller");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =========================
// Public Routes
// =========================

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// =========================
// Protected Routes (Admin Only)
// =========================

// Get All Users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);

// Get User Password
router.get(
    "/password/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getUserPassword
);

// Get User By ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getUserById
);

// Update User
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateUser
);

// Delete User
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteUser
);

module.exports = router;