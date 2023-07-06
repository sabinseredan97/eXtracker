const express = require("express");
const router = express.Router();
const { getUserData } = require("../controllers/profileController/getUserData");

router.get("/:username", getUserData);

module.exports = router;
