const jobTypeDefs = `#graphql
  type JobStats {
    total: Int
    pending: Int
    inProgress: Int
    completed: Int
    verified: Int
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    location: String!
    status: String!
    priority: String
    completionNote: String

    technician: User
    client: User
    createdBy: User

    createdAt: String
    updatedAt: String
  }

  type Query {
    jobs(status: String): [Job]
    jobStats: JobStats
  }

  type Mutation {
    createJob(
      title: String!
      description: String!
      location: String!
      technicianId: ID!
      clientId: ID!
      priority: String
    ): Job

    updateJobStatus(jobId: ID!, status: String!): Job
    cancelJob(jobId: ID!): Job
    reassignJob(jobId: ID!, technicianId: ID!): Job
    rejectJobCompletion(jobId: ID!): Job
  }
`;

module.exports = jobTypeDefs;
