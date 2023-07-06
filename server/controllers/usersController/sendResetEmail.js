const { users } = require("../../models");
const { sendUserResetEmail } = require("../../middlewares/sendUserVerifyEmail");
const { resultsValidator } = require("../../middlewares/userDataValidation");

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

module.exports = { sendResetEmail };
