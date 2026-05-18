// Environment configuration placeholder
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/fieldsync",
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
};
