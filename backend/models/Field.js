// Field model placeholder
const mongoose = require("mongoose");
const FieldSchema = new mongoose.Schema({
  name: String,
  location: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Field", FieldSchema);
