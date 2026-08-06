const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require("../controllers/rolecontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("role");

router.post("/", authMiddleware, roleMiddleware(...allowed), createRole);

router.get("/", authMiddleware, roleMiddleware(...allowed), getAllRoles);

router.get("/:id", authMiddleware, roleMiddleware(...allowed), getRoleById);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateRole);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deleteRole);

module.exports = router;