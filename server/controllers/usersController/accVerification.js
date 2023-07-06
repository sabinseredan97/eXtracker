const { users, emailVerifyTkn } = require("../../models");
const { Op } = require("sequelize");

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

module.exports = { verifyAccount };
