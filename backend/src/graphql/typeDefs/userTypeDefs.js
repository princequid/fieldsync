const userTypeDefs = `#graphql

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Query {
    users(role: String): [User]
    me: User
  }

  type Mutation {

    register(
      name: String!
      email: String!
      password: String!
      role: String!
    ): AuthResponse

    login(
      email: String!
      password: String!
    ): AuthResponse
  }
`;

module.exports = userTypeDefs;