const express = require("express");

const router = express.Router();

const {
  createDesignation,
  getDesignations,
} = require("../controllers/designationcontroller");

// Create Designation
router.post("/", createDesignation);

// Get All Designations
router.get("/", getDesignations);

module.exports = router;