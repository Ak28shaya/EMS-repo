const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/authcontroller");

router.post("/register", register);
router.post("/login", login);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;