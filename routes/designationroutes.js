const express = require("express");
const router = express.Router();

const {
  createDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} = require("../controllers/designationController");

// Create Designation
router.post("/", createDesignation);

// Get All Designations
router.get("/", getDesignations);

// Get Designation By ID
router.get("/:id", getDesignationById);

// Update Designation
router.put("/:id", updateDesignation);

// Delete Designation
router.delete("/:id", deleteDesignation);

module.exports = router;