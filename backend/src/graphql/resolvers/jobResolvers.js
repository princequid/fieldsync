const Job = require("../../models/Job");

const User = require("../../models/User");

const authorizeRoles = require("../../middleware/roleMiddleware");

const Notification = require("../../models/Notification");

const formatDate = require("../../utils/formatDate");

const allowedTransitions = {
  PENDING: ["IN_PROGRESS"],

  IN_PROGRESS: ["COMPLETED"],

  COMPLETED: ["VERIFIED"],

  VERIFIED: [],
};

const {
  validateStatusTransition,
  getPopulatedJob,
} = require("../../services/jobService");

const { createNotification } = require("../../services/notificationService");

const jobResolvers = {
  Job: {
    createdAt: (job) => formatDate(job.createdAt),
    updatedAt: (job) => formatDate(job.updatedAt),
  },

  Query: {
    jobs: async (_, { status }, context) => {
      authorizeRoles("ADMIN", "TECHNICIAN")(context.user);

      // admin sees all jobs
      if (context.user.role === "ADMIN") {
        const filter = {};

        if (status) {
          filter.status = status;
        }

        return await Job.find(filter)
          .populate("technician")
          .populate("client")
          .populate("createdBy");
      }

      // technician sees only assigned jobs
      return await Job.find({
        technician: context.user._id,
      }).sort({ createdAt: -1 })
        .populate("technician")
        .populate("client")
        .populate("createdBy");
    },
    jobStats: async (_, args, context) => {
      authorizeRoles("ADMIN")(context.user);

      const total = await Job.countDocuments();

      const pending = await Job.countDocuments({
        status: "PENDING",
      });

      const inProgress = await Job.countDocuments({
        status: "IN_PROGRESS",
      });

      const completed = await Job.countDocuments({
        status: "COMPLETED",
      });

      const verified = await Job.countDocuments({
        status: "VERIFIED",
      });

      return {
        total,
        pending,
        inProgress,
        completed,
        verified,
      };
    },
  },

  Mutation: {
    createJob: async (_, args, context) => {
      authorizeRoles("ADMIN")(context.user);

      const { title, description, location, technicianId, clientId, priority } = args;

      // validate technician
      const technician = await User.findById(technicianId);

      if (!technician || technician.role !== "TECHNICIAN") {
        throw new Error("Invalid technician");
      }

      // validate client
      const client = await User.findById(clientId);

      if (!client || client.role !== "CLIENT") {
        throw new Error("Invalid client");
      }

      // create job
      const job = await Job.create({
        title,
        description,
        location,
        priority: priority ?? "MEDIUM",
        technician: technicianId,
        client: clientId,
        createdBy: context.user._id,
      });

      return await Job.findById(job._id)
        .populate("technician")
        .populate("client")
        .populate("createdBy");
    },

    updateJobStatus: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const { jobId, status } = args;

      const job = await Job.findById(jobId);

      if (!job) {
        throw new Error("Job not found");
      }

      // technician permissions
      if (context.user.role === "TECHNICIAN") {
        // technician can only update assigned jobs
        if (job.technician.toString() !== context.user._id.toString()) {
          throw new Error("Not authorized for this job");
        }

        // technician cannot verify jobs
        if (status === "VERIFIED") {
          throw new Error("Technicians cannot verify jobs");
        }
      }

      // only admin can verify
      if (status === "VERIFIED" && context.user.role !== "ADMIN") {
        throw new Error("Only admins can verify jobs");
      }

      // validate lifecycle transition
      if (!validateStatusTransition(job.status, status)) {
        throw new Error(
          `Invalid status transition from ${job.status} to ${status}`,
        );
      }

      // update status
      job.status = status;

      await job.save();
      await createNotification({
        client: job.client,

        job: job._id,

        message: `Job "${job.title}" status updated to ${status}`,
      });

      return await getPopulatedJob(job._id);
    },

    cancelJob: async (_, { jobId }, context) => {
      authorizeRoles("ADMIN")(context.user);

      const job = await Job.findById(jobId);
      if (!job) throw new Error("Job not found");
      if (job.status === "VERIFIED") throw new Error("Cannot cancel a verified job");

      job.status = "CANCELLED";
      await job.save();
      return await getPopulatedJob(job._id);
    },

    reassignJob: async (_, { jobId, technicianId }, context) => {
      authorizeRoles("ADMIN")(context.user);

      const job = await Job.findById(jobId);
      if (!job) throw new Error("Job not found");

      const technician = await User.findById(technicianId);
      if (!technician || technician.role !== "TECHNICIAN") throw new Error("Invalid technician");

      job.technician = technicianId;
      await job.save();

      await createNotification({
        client: job.client,
        job: job._id,
        message: `Job "${job.title}" reassigned to ${technician.name}`,
      });

      return await getPopulatedJob(job._id);
    },

    rejectJobCompletion: async (_, { jobId }, context) => {
      authorizeRoles("ADMIN")(context.user);

      const job = await Job.findById(jobId);
      if (!job) throw new Error("Job not found");
      if (job.status !== "COMPLETED") throw new Error("Job is not in COMPLETED status");

      job.status = "IN_PROGRESS";
      await job.save();

      await createNotification({
        client: job.client,
        job: job._id,
        message: `Job "${job.title}" completion was rejected, returned to In Progress`,
      });

      return await getPopulatedJob(job._id);
    },
  },
};

module.exports = jobResolvers;
