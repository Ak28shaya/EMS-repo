const express = require("express");

const router = express.Router();

const {
  createNotice,
  getNotices,
} = require("../controllers/noticecontroller");

router.post("/", createNotice);

router.get("/", getNotices);

module.exports = router;    