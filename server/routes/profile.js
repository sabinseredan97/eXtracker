const express = require("express");
const router = express.Router();
const {
  getUserData,
  getCategories,
  addProduct,
} = require("../controllers/profileController");
const { authenticateToken } = require("../middlewares/tokenAuth");
const { productValidator } = require("../middlewares/userDataValidation");

router.get("/user-data/:username", authenticateToken, getUserData);

router.get("/categories", authenticateToken, getCategories);

router.post("/add/product", authenticateToken, productValidator(), addProduct);

module.exports = router;
