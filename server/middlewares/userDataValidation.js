const { users } = require("../models");
const { check, validationResult } = require("express-validator");

async function verifyUsername(req, res, next) {
  const { username } = req.body;
  const userName = await users.findOne({ where: { username: username } });
  if (userName)
    return res.status(409).send({ error: "This username is already taken" });
  return next();
}

async function verifyEmail(req, res, next) {
  const { email } = req.body;
  const userEmail = await users.findOne({ where: { email: email } });
  if (userEmail)
    return res.status(409).send({ error: "This email is already registered" });
  return next();
}

async function verifyIfUserExits(req, res, next) {
  const { username, email } = req.body;
  const user = await users.findOne({
    where: { username: username, email: email },
  });
  if (user)
    return res.status(409).send({ error: "You already have an account!" });
  return next();
}

function resultsValidator(req) {
  const messages = [];
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array();
    for (const i of errors) {
      messages.push(i);
    }
  }
  return messages;
}

function registerValidator() {
  return [
    check("username")
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("username must be 5-20 characters")
      .not()
      .custom((val) => /[^A-za-z0-9\s]/g.test(val))
      .withMessage("Username not use uniq characters"),
    check("email").isEmail(),
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 7, max: 20 })
      .withMessage("password must be 7-20 characters"),
  ];
}

function loginValidator() {
  return [
    check("username")
      .notEmpty()
      .withMessage("username or email is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("username must be 5-20 characters")
      .not()
      .custom((val) => /[^A-za-z0-9\s]/g.test(val))
      .withMessage("Username not use uniq characters"),
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 7, max: 20 })
      .withMessage("password must be 7-20 characters"),
  ];
}

function resetPwdValidator() {
  return [
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 7, max: 20 })
      .withMessage("password must be 7-20 characters"),
  ];
}

function emailValidator() {
  return [check("email").isEmail()];
}

function productValidator() {
  let minPrice = 0.01;
  let maxPrice = 9999999.99;
  return [
    check("category").notEmpty().withMessage("category is required"),
    check("product").notEmpty().withMessage("product is required"),
    check("price")
      .notEmpty()
      .withMessage("price is required")
      .isDecimal()
      .isLength({ min: minPrice, max: maxPrice }),
    check("currency").notEmpty().withMessage("currency is required"),
  ];
}

module.exports = {
  verifyUsername,
  verifyEmail,
  verifyIfUserExits,
  loginValidator,
  registerValidator,
  resultsValidator,
  resetPwdValidator,
  emailValidator,
  productValidator,
};
