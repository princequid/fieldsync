const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = async ({ req }) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return null;
    }

    // Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // get user
    const user = await User.findById(decoded.id);

    return user;

  } catch (error) {

    return null;
  }
};

module.exports = authMiddleware;
