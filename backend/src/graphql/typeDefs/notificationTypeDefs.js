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

  type Mutation {
    markNotificationRead(notificationId: ID!): Notification
    markAllNotificationsRead: Boolean
  }
`;

module.exports = notificationTypeDefs;