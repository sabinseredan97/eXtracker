const { users } = require("../../models");
const bcrypt = require("bcrypt");

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
  if (!match) return res.status(404).send({ message: "wrong password!" });
  await users.destroy({
    where: { username: username },
  });
  return res.status(204).send({ message: "account deleted" });
}

module.exports = { deleteUserAccount };
