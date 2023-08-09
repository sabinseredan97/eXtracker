const express = require("express");
const router = express.Router();
const { getUserData } = require("../controllers/profileController");
const { authenticateToken } = require("../middlewares/tokenAuth");
const { getCategories } = require("../controllers/profileController");
const { addProduct } = require("../controllers/profileController");
const { productValidator } = require("../middlewares/userDataValidation");

router.get("/user-data/:username", authenticateToken, getUserData);

router.get("/categories", authenticateToken, getCategories);

router.post("/add/product", authenticateToken, productValidator(), addProduct);

module.exports = router;
