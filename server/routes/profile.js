const express = require("express");
const router = express.Router();
const { getUserData } = require("../controllers/profileController/getUserData");
const { authenticateToken } = require("../middlewares/tokenAuth");

router.get("/:username", authenticateToken, getUserData);

module.exports = router;
