const userResolvers = require("./userResolvers");
const jobResolvers = require("./jobResolvers");
const notificationResolvers = require("./notificationResolvers");

const resolvers = {

  Query: {
    ...userResolvers.Query,
    ...jobResolvers.Query,
    ...notificationResolvers.Query
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...jobResolvers.Mutation,
  }
};

module.exports = resolvers;