const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyAccount,
  deleteUserAccount,
  sendResetEmail,
  resetPwd,
} = require("../controllers/usersController");
const {
  verifyEmail,
  verifyUsername,
  verifyIfUserExits,
  loginValidator,
  registerValidator,
  emailValidator,
  resetPwdValidator,
} = require("../middlewares/userDataValidation");
const { isResetTknValid } = require("../middlewares/resetPwdValidation");
const { authenticateToken } = require("../middlewares/tokenAuth");

router.post(
  "/register",
  registerValidator(),
  verifyIfUserExits,
  verifyUsername,
  verifyEmail,
  registerUser
);

router.post("/login", loginValidator(), loginUser);

router.post("/logout", logoutUser);

router.get("/verify/:id/:verifyTkn", verifyAccount);

router.post("/delete/:username", authenticateToken, deleteUserAccount);

router.post("/forgot-password/sendEmail", emailValidator(), sendResetEmail);

router.put(
  "/reset-password/:id/:token",
  isResetTknValid,
  resetPwdValidator(),
  resetPwd
);

module.exports = router;
