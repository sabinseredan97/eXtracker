const { verify } = require("jsonwebtoken");
const { createTokens } = require("../usersController/createJWT");
require("dotenv").config();

function validateToken(req, res) {
  const accessToken = req.cookies["access-token"];
  try {
    if (!accessToken) throw new Error("New access token needed!");
    const validToken = verify(accessToken, process.env.JWT_SECRETKEY);
    if (validToken) {
      return res.status(200).send({ accessToken: validToken });
    } else {
      throw new Error("Access token is not valid");
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
}

function validateRefreshToken(req, res) {
  const refreshToken = req.cookies["refresh-token"];
  try {
    if (!refreshToken) throw new Error("Refresh token is missing!");
    const validToken = verify(refreshToken, process.env.JWT_REFRESH_KEY);
    if (validToken) {
      const accessToken = createTokens(
        validToken,
        "4m",
        process.env.JWT_SECRETKEY
      );
      res.cookie("access-token", accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).send({ accessToken });
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
}

module.exports = { validateToken, validateRefreshToken };
