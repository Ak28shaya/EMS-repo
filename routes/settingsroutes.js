const express = require("express");

const router = express.Router();

const {
  createSettings,
  getSettings,
  updateSettings,
  
} = require("../controllers/settingscontroller");

router.post("/", createSettings);

router.get("/", getSettings);

router.put("/:id", updateSettings);





module.exports = router;