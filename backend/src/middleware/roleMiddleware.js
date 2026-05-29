const authorizeRoles = (...roles) => {

  return (user) => {

    if (!user) {
      throw new Error("Not authenticated");
    }

    if (!roles.includes(user.role)) {
      throw new Error("Not authorized");
    }
  };
};

module.exports = authorizeRoles;