const express = require("express");
const router = express.Router();
const { getUserData } = require("../controllers/profileController/getUserData");
const { authenticateToken } = require("../middlewares/tokenAuth");
const {
  getCategories,
} = require("../controllers/profileController/getCategories");

router.get("/:username", authenticateToken, getUserData);

router.get("/categories", authenticateToken, getCategories);

module.exports = router;
