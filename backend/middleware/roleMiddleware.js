// roleMiddleware placeholder
module.exports =
  (roles = []) =>
  (req, res, next) => {
    if (!roles.length || roles.includes(req.user?.role)) return next();
    return res.status(403).json({ error: "Forbidden" });
  };
