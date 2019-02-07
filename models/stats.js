const mongoose = require("mongoose");

var ObjectId = mongoose.Schema.ObjectId;

var TaskSchema = new mongoose.Schema({
  userId: { type: ObjectId },
  quantitiy: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("stats", TaskSchema);
