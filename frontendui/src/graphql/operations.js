import { gql } from "@apollo/client";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
    register(name: $name, email: $email, password: $password, role: $role) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

// ─── Users ───────────────────────────────────────────────────────────────────

export const GET_USERS = gql`
  query GetUsers($role: String) {
    users(role: $role) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

// ─── Jobs ────────────────────────────────────────────────────────────────────

const JOB_FIELDS = gql`
  fragment JobFields on Job {
    id
    title
    description
    location
    status
    priority
    completionNote
    createdAt
    updatedAt
    technician {
      id
      name
      email
      role
    }
    client {
      id
      name
      email
      role
    }
    createdBy {
      id
      name
      email
      role
    }
  }
`;

export const GET_JOBS = gql`
  ${JOB_FIELDS}
  query GetJobs($status: String) {
    jobs(status: $status) {
      ...JobFields
    }
  }
`;

export const GET_JOB_STATS = gql`
  query GetJobStats {
    jobStats {
      total
      pending
      inProgress
      completed
      verified
    }
  }
`;

export const CREATE_JOB = gql`
  ${JOB_FIELDS}
  mutation CreateJob(
    $title: String!
    $description: String!
    $location: String!
    $technicianId: ID!
    $clientId: ID!
    $priority: String
  ) {
    createJob(
      title: $title
      description: $description
      location: $location
      technicianId: $technicianId
      clientId: $clientId
      priority: $priority
    ) {
      ...JobFields
    }
  }
`;

export const UPDATE_JOB_STATUS = gql`
  ${JOB_FIELDS}
  mutation UpdateJobStatus($jobId: ID!, $status: String!) {
    updateJobStatus(jobId: $jobId, status: $status) {
      ...JobFields
    }
  }
`;

export const CANCEL_JOB = gql`
  ${JOB_FIELDS}
  mutation CancelJob($jobId: ID!) {
    cancelJob(jobId: $jobId) {
      ...JobFields
    }
  }
`;

export const REASSIGN_JOB = gql`
  ${JOB_FIELDS}
  mutation ReassignJob($jobId: ID!, $technicianId: ID!) {
    reassignJob(jobId: $jobId, technicianId: $technicianId) {
      ...JobFields
    }
  }
`;

export const REJECT_JOB_COMPLETION = gql`
  ${JOB_FIELDS}
  mutation RejectJobCompletion($jobId: ID!) {
    rejectJobCompletion(jobId: $jobId) {
      ...JobFields
    }
  }
`;

// ─── Notifications ────────────────────────────────────────────────────────────

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      message
      isRead
      createdAt
      job {
        id
        title
      }
      client {
        id
        name
        email
      }
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
