const { users, resetPwdTkn } = require("../models");

async function isResetTknValid(req, res, next) {
  const { token, id } = req.params;
  if (!token || !id)
    return res.status(400).send({ message: "Invalid request!" });
  const user = await users.findOne({ where: { id: id } });
  if (!user) return res.status(404).send({ message: "An error occured!" });
  const resetToken = await resetPwdTkn.findOne({ where: { userId: id } });
  if (!resetToken)
    return res.status(404).send({ message: "An error occured!" });
  const isValid = resetToken.resetTkn === token;
  if (!isValid) return res.status(400).send({ message: "Not a valid token!" });
  req.user = user;
  next();
}

module.exports = { isResetTknValid };
