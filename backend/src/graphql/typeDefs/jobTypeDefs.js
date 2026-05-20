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
    ): Job

    updateJobStatus(
  jobId: ID!
  status: String!
): Job
  }
`;

module.exports = jobTypeDefs;
