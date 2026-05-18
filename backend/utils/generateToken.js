const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
module.exports = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
