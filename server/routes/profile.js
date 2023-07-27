const express = require("express");
const router = express.Router();
const { getUserData } = require("../controllers/profileController/getUserData");
const { authenticateToken } = require("../middlewares/tokenAuth");
const {
  getCategories,
} = require("../controllers/profileController/getCategories");
const { addProduct } = require("../controllers/profileController/addProduct");

router.get("/user-data/:username", authenticateToken, getUserData);

router.get("/categories", authenticateToken, getCategories);

router.post("/add/product", authenticateToken, addProduct);

module.exports = router;
