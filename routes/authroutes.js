const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    resetUserPassword,
    getCurrentUser
} = require("../controllers/authcontroller");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const allowedRoleAccess = ROLE_PERMISSIONS.getAllowedRoleVariants("role");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

router.get("/", authMiddleware, roleMiddleware(...allowedRoleAccess), getAllUsers);

router.get("/:id", authMiddleware, roleMiddleware(...allowedRoleAccess), getUserById);

router.put("/:id", authMiddleware, roleMiddleware(...allowedRoleAccess), updateUser);

router.delete("/:id", authMiddleware, roleMiddleware(...allowedRoleAccess), deleteUser);

router.put(
    "/:id/reset-password",
    authMiddleware,
    roleMiddleware("Admin"),
    resetUserPassword
);

module.exports = router;