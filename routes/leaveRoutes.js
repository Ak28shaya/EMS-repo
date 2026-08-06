const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
  deleteLeave,
} = require("../controllers/leaveController");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("leave");

router.post("/", authMiddleware, roleMiddleware(...allowed), applyLeave);

router.get("/", authMiddleware, roleMiddleware(...allowed), getAllLeaves);

router.get("/me", authMiddleware, getMyLeaves);

router.get(
  "/employee/:employeeId",
  authMiddleware,
  roleMiddleware(...allowed),
  getEmployeeLeaves
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(...allowed),
  updateLeaveStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(...allowed),
  deleteLeave
);

module.exports = router;