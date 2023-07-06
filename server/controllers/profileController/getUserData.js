const { users } = require("../../models");

async function getUserData(req, res) {
  const { username } = req.params;
  const user = await users.findOne({ where: { username: username } });
  return res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    verified: user.verified,
    createdAt: user.createdAt,
  });
}

module.exports = { getUserData };
