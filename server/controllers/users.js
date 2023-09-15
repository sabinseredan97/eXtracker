const { users, emailVerifyTkn, resetPwdTkn, products } = require("../models");
const bcrypt = require("bcrypt");
const { sendUserVerifyEmail } = require("../middlewares/sendUserVerifyEmail");
const { resultsValidator } = require("../middlewares/userDataValidation");
const { createTokens } = require("../middlewares/createToken");
const { Op } = require("sequelize");
const { sendUserResetEmail } = require("../middlewares/sendUserVerifyEmail");
require("dotenv").config("../.env");

async function register(req, res) {
  const errors = resultsValidator(req);
  if (errors.length > 0) {
    return res.status(400).send({
      method: req.method,
      status: res.statusCode,
      error: errors,
    });
  }
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const user = await users.findOne({ where: { username: username } });
    sendUserVerifyEmail(user.id, user.email);
    return res.status(201).send({
      message: "An verification email was sent to your adress!",
    });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function login(req, res) {
  const errors = resultsValidator(req);
  if (errors.length > 0) {
    return res.status(400).send({
      method: req.method,
      status: res.statusCode,
      error: errors,
    });
  }
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ where: { username: username } });
    if (!user) {
      return res.status(400).send({ error: "User doesn't exist" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .send({ error: "Wrong username and password combination" });
    if (!user.verified) {
      sendUserVerifyEmail(user.id, user.email);
      return res
        .status(201)
        .send({ message: "An verification email was sent to your adress!" });
    }
    const accessToken = createTokens(user, "1d", process.env.JWT_SECRETKEY);
    const day = 86400000;
    res.cookie("access-token", accessToken, {
      maxAge: day,
      httpOnly: true,
    });
    return res.status(200).send({
      message: "Logged in",
      username,
      accessToken,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
}

function logoutUser(req, res) {
  try {
    res.cookie("access-token", "", { maxAge: 1 });
  } catch (err) {
    return res.status(404).send(err);
  }
  return res.status(200).send("logged out");
}

async function verifyAccount(req, res) {
  try {
    const { id, verifyTkn } = req.params;
    const user = await users.findOne({ where: { id: id } });
    if (!user) return res.status(400).send({ message: "Invalid link" });
    const verificationTkn = await emailVerifyTkn.findOne({
      where: { userId: id, verifyTkn: verifyTkn },
    });
    if (!verificationTkn)
      return res.status(401).send({ message: "invalid link" });
    await users.update(
      {
        verified: true,
      },
      {
        where: { id: id },
      }
    );
    await emailVerifyTkn.destroy({
      where: {
        [Op.or]: [
          { verifyTkn: verifyTkn },
          { expiresAt: { [Op.lte]: Date.now() } },
        ],
      },
    });
    return res.status(200).send({ message: "Email verified successfully!" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
}

async function deleteUserAccount(req, res) {
  const { username } = req.params;
  const { password } = req.body;
  const user = await users.findOne({
    where: { username: username },
  });
  if (!user)
    return res.status(404).send({
      message: "A error occured and your account could not be deleted",
    });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(409).send({ message: "wrong password!" });
  await products.destroy({ where: { userId: user.id } });
  await users.destroy({
    where: { username: username },
  });
  return res.status(204).send({ message: "account deleted" });
}

async function sendResetEmail(req, res) {
  const errors = resultsValidator(req);
  if (errors.length > 0) {
    return res.status(400).send({
      method: req.method,
      status: res.statusCode,
      error: errors,
    });
  }
  try {
    const { email } = req.body;
    const user = await users.findOne({ where: { email: email } });
    if (!user)
      return res
        .status(404)
        .send({ message: "Email was not sent to the specified adress" });
    sendUserResetEmail(user.id, email);
    return res.status(201).send({ message: "Email sent to your adress!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function resetPwd(req, res) {
  const errors = resultsValidator(req);
  if (errors.length > 0) {
    return res.status(400).send({
      method: req.method,
      status: res.statusCode,
      error: errors,
    });
  }
  const { password } = req.body;
  const user = req.user;
  try {
    const pwdTkn = await resetPwdTkn.findOne({
      where: { userId: user.id },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.update(
      {
        password: hashedPassword,
      },
      {
        where: { id: user.id },
      }
    );
    await resetPwdTkn.destroy({
      where: {
        [Op.or]: [
          { resetTkn: pwdTkn.resetTkn },
          { expiresAt: { [Op.lte]: Date.now() } },
        ],
      },
    });
    return res.status(200).send({ message: "password reseted" });
  } catch (error) {
    return res.status(400).send({
      message: "An error occured while trying to reset your password",
    });
  }
}

async function getUserData(req, res) {
  const { username } = req.params;
  try {
    const user = await users.findOne({ where: { username: username } });
    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.sendStatus(404);
  }
}

async function isLoggedIn(req, res) {
  res.status(200).send(req.user.username);
}

module.exports = {
  register,
  login,
  logoutUser,
  verifyAccount,
  deleteUserAccount,
  sendResetEmail,
  resetPwd,
  getUserData,
  isLoggedIn,
};
