const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} = require("../controllers/designationcontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("designation");

router.post("/", authMiddleware, roleMiddleware(...allowed), createDesignation);

router.get("/", authMiddleware, roleMiddleware(...allowed), getDesignations);

router.get("/:id", authMiddleware, roleMiddleware(...allowed), getDesignationById);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateDesignation);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deleteDesignation);

module.exports = router;