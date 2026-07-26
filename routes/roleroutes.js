const express = require("express");
const router = express.Router();
const {
    getAllRoles,
    createRole
} = require("../controllers/rolescontroller");

router.get("/", getAllRoles);
router.post("/", createRole);

module.exports = router;