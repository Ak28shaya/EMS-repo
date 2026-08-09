const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authcontroller");

// ==============================
// REGISTER
// POST /auth/register
// ==============================
router.post("/register", register);

// ==============================
// LOGIN
// POST /auth/login
// ==============================
router.post("/login", login);

// ==============================
// GET CURRENT USER
// GET /auth/me
// ==============================
router.get("/me", authMiddleware, getMe);

// ==============================
// GET ALL USERS
// GET /auth
// ==============================
router.get("/", getAllUsers);

// ==============================
// GET USER BY ID
// GET /auth/:id
// ==============================
router.get("/:id", getUserById);

// ==============================
// UPDATE USER
// PUT /auth/:id
// ==============================
router.put("/:id", updateUser);

// ==============================
// DELETE USER
// DELETE /auth/:id
// ==============================
router.delete("/:id", deleteUser);

module.exports = router;