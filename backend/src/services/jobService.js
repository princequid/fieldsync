const Job = require("../models/Job");

const allowedTransitions = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: ["VERIFIED", "IN_PROGRESS"],
  VERIFIED: [],
  CANCELLED: []
};

const validateStatusTransition = (
  currentStatus,
  nextStatus
) => {

  const allowedNextStatuses =
    allowedTransitions[currentStatus];

  return allowedNextStatuses.includes(
    nextStatus
  );
};

const getPopulatedJob = async (jobId) => {

  return await Job.findById(jobId)
    .populate("technician")
    .populate("client")
    .populate("createdBy");
};

module.exports = {
  validateStatusTransition,
  getPopulatedJob
};