const userTypeDefs = require("./userTypeDefs");
const jobTypeDefs = require("./jobTypeDefs");
const notificationTypeDefs = require("./notificationTypeDefs");

const typeDefs = `
  ${userTypeDefs}
  ${jobTypeDefs}
  ${notificationTypeDefs}
`;

module.exports = typeDefs;