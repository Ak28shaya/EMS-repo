const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLE_PERMISSIONS = require("../config/rolepermissions");

const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticecontroller");

const allowed = ROLE_PERMISSIONS.getAllowedRoleVariants("notice");

router.post("/", authMiddleware, roleMiddleware(...allowed), createNotice);

router.get("/", authMiddleware, roleMiddleware(...allowed), getNotices);

router.get("/:id", authMiddleware, roleMiddleware(...allowed), getNoticeById);

router.put("/:id", authMiddleware, roleMiddleware(...allowed), updateNotice);

router.delete("/:id", authMiddleware, roleMiddleware(...allowed), deleteNotice);

module.exports = router;