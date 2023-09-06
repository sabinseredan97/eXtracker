const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logoutUser,
  verifyAccount,
  deleteUserAccount,
  sendResetEmail,
  resetPwd,
  getUserData,
  isLoggedIn,
} = require("../controllers/users");
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
  register
);

router.post("/login", loginValidator(), login);

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

router.get("/data/:username", authenticateToken, getUserData);

router.get("/logged-in", authenticateToken, isLoggedIn);

module.exports = router;
