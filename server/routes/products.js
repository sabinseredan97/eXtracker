const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/tokenAuth");
const {
  getCategories,
} = require("../controllers/productsController/getCategories");
const { addProduct } = require("../controllers/productsController/addProduct");
const { productValidator } = require("../middlewares/userDataValidation");

router.get("/categories", authenticateToken, getCategories);

router.post("/add/product", authenticateToken, productValidator(), addProduct);

module.exports = router;
