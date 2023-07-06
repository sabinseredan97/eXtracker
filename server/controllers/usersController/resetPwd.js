const { users, resetPwdTkn } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { resultsValidator } = require("../../middlewares/userDataValidation");

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

module.exports = { resetPwd };
