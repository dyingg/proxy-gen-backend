const mongoose = require("mongoose");

var ObjectId = mongoose.Schema.ObjectId;

var TaskSchema = new mongoose.Schema({
  userId: { required: true, type: ObjectId },
  taskName: { required: true, type: String },
  provider: { required: true, type: String },
  quantity: { required: true, type: Number },
  authUserName: { required: true, type: String },
  authPassword: { required: true, type: String },
  location: { required: true, type: String },
  completed: { type: Boolean },
  progressQuantity: { type: Number, default: 0 },
  proxyErrors: { type: [String] },
  failed: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  timeStamp: { type: Number, default: Date.now() },
  guid: { type: String }
});

module.exports = mongoose.model("tasks", TaskSchema);
