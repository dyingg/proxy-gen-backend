const mongoose = require("mongoose");

var ActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  actionType: { type: Number },
  actionMessage: { type: String },
  timeStamp: { type: Number, default: Date.now() }
});

module.exports = mongoose.model("actions", ActionSchema);
