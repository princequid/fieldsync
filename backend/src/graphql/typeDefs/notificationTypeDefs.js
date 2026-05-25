const notificationTypeDefs = `#graphql

  type Notification {
    id: ID!

    client: User
    job: Job

    message: String!
    isRead: Boolean!

    createdAt: String
    updatedAt: String
  }

  type Query {
    notifications: [Notification]
  }
`;

module.exports = notificationTypeDefs;