const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createSettings,
  getSettings,
  updateSettings,
} = require("../controllers/settingscontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("settings");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(...allowed),
  createSettings
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(...allowed),
  getSettings
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(...allowed),
  updateSettings
);

module.exports = router;