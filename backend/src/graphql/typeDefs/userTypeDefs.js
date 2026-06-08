const userTypeDefs = `#graphql

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    address: String
    role: String!
    mustChangePassword: Boolean
    createdAt: String
    updatedAt: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type CreateTechnicianResponse {
    user: User!
    temporaryPassword: String!
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
      phone: String
      address: String
    ): AuthResponse

    createTechnician(
      name: String!
      email: String!
      phone: String
    ): CreateTechnicianResponse

    changePassword(
      currentPassword: String!
      newPassword: String!
    ): AuthResponse

    login(
      email: String!
      password: String!
    ): AuthResponse
  }
`;

module.exports = userTypeDefs;