const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    resetUserPassword
} = require("../controllers/authcontroller");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/", authMiddleware, roleMiddleware("Admin"), getAllUsers);

router.get("/:id", authMiddleware, roleMiddleware("Admin"), getUserById);

router.put("/:id", authMiddleware, roleMiddleware("Admin"), updateUser);

router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteUser);

router.put(
    "/:id/reset-password",
    authMiddleware,
    roleMiddleware("Admin"),
    resetUserPassword
);

module.exports = router;