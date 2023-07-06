const { users } = require("../../models");
const bcrypt = require("bcrypt");
const {
  sendUserVerifyEmail,
} = require("../../middlewares/sendUserVerifyEmail");
const { resultsValidator } = require("../../middlewares/userDataValidation");

async function registerUser(req, res) {
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

module.exports = { registerUser };
