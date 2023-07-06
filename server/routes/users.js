const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/usersController/registerUser");
const { loginUser } = require("../controllers/usersController/loginUser");
const {
  verifyEmail,
  verifyUsername,
  verifyIfUserExits,
  loginValidator,
  registerValidator,
  emailValidator,
  resetPwdValidator,
} = require("../middlewares/userDataValidation");
const {
  validateToken,
  validateRefreshToken,
} = require("../controllers/usersController/validateTokens");
const { logoutUser } = require("../controllers/usersController/lgoutUser");
const {
  verifyAccount,
} = require("../controllers/usersController/accVerification");
const {
  deleteUserAccount,
} = require("../controllers/usersController/deleteAccount");
const {
  sendResetEmail,
} = require("../controllers/usersController/sendResetEmail");
const { resetPwd } = require("../controllers/usersController/resetPwd");
const { isResetTknValid } = require("../middlewares/resetPwdValidation");

router.post(
  "/register",
  registerValidator(),
  verifyIfUserExits,
  verifyUsername,
  verifyEmail,
  registerUser
);

router.post("/login", loginValidator(), loginUser);

router.get("/auth", validateToken);

router.get("/refresh", validateRefreshToken);

router.post("/logout", logoutUser);

router.get("/verify/:id/:verifyTkn", verifyAccount);

router.post("/delete/:username", deleteUserAccount);

router.post("/forgot-password/sendEmail", emailValidator(), sendResetEmail);

router.put(
  "/reset-password/:id/:token",
  isResetTknValid,
  resetPwdValidator(),
  resetPwd
);

module.exports = router;
