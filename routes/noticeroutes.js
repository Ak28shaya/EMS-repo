const express = require("express");
const router = express.Router();

const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

router.post("/", createNotice);
router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

module.exports = router;