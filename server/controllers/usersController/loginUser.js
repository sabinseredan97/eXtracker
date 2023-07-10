const { users } = require("../../models");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
  sendUserVerifyEmail,
} = require("../../middlewares/sendUserVerifyEmail");
const { createTokens } = require("../usersController/createJWT");
const { resultsValidator } = require("../../middlewares/userDataValidation");

async function loginUser(req, res) {
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

module.exports = { loginUser };
