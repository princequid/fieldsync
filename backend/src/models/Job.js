const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "VERIFIED"
      ],
      default: "PENDING"
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);