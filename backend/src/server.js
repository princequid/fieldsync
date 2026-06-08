require("dotenv").config();

const http = require("http");

const { ApolloServer } = require("@apollo/server");

const { expressMiddleware } = require("@as-integrations/express5");

const app = require("./app");

const connectDB = require("./config/db");

const authMiddleware = require("./middleware/authMiddleware");


async function startServer() {
  // connect database
  await connectDB();

  // create apollo server
  const { typeDefs, resolvers } = require("./graphql/schema");

  const server = new ApolloServer({
    typeDefs,

    resolvers,

    formatError: (err) => {
      return {
        message: err.message,
      };
    },
  });

  await server.start();

  app.use(
    "/graphql",

    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: await authMiddleware({ req }),
      }),
    }),
  );

  const PORT = process.env.PORT || 5000;

  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
