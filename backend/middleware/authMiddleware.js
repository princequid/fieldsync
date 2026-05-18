// authMiddleware placeholder
module.exports = (req, res, next) => {
  // simple stub
  req.user = { id: "stub", role: "admin" };
  next();
};
