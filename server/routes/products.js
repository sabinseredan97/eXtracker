const express = require("express");
const router = express.Router();
const {
  getCategories,
  addProduct,
  getProducts,
  deleteProduct,
  getTotalExpenses,
} = require("../controllers/products");
const { authenticateToken } = require("../middlewares/tokenAuth");
const { productValidator } = require("../middlewares/userDataValidation");

router.get("/categories", authenticateToken, getCategories);

router.post("/add/product", authenticateToken, productValidator(), addProduct);

router.get(
  "/get-products/:order/:column/:startDate/:endDate",
  authenticateToken,
  getProducts
);

router.delete("/delete-one/:id", authenticateToken, deleteProduct);

router.get(
  "/total-expenses/:startDate/:endDate",
  authenticateToken,
  getTotalExpenses
);

module.exports = router;
