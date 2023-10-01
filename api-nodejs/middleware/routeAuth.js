const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    req.user = null
  }
  try {
    const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    req.user = null
    // req.user.tokenExpired = true
  }
  return next();
};

module.exports = verifyToken;