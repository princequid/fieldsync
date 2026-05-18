// Report model placeholder
const mongoose = require("mongoose");
const ReportSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Report", ReportSchema);
