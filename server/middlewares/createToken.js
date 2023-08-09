const { sign } = require("jsonwebtoken");
require("dotenv").config();

function createTokens(user, expireTime, secretKey) {
  const token = sign({ username: user.username, id: user.id }, secretKey, {
    expiresIn: expireTime,
  });
  return token;
}

module.exports = {
  createTokens,
};
