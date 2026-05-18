// Notification model placeholder
const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Notification", NotificationSchema);
