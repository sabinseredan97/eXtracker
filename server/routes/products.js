const express = require("express");
const router = express.Router();
const {
  getCategories,
  addProduct,
} = require("../controllers/productsController");
const { authenticateToken } = require("../middlewares/tokenAuth");
const { productValidator } = require("../middlewares/userDataValidation");

router.get("/categories", authenticateToken, getCategories);

router.post("/add/product", authenticateToken, productValidator(), addProduct);

module.exports = router;
