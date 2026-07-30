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

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    getAllUsers
);
router.get("/password/:id", getUserPassword);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    getUserById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    deleteUser
);

module.exports = router;//authroutes