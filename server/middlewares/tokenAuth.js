const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.cookies["access-token"];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

module.exports = { authenticateToken };
