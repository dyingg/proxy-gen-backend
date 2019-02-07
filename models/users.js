const mongoose = require("mongoose");

var ObjectId = mongoose.Schema.ObjectId;

var usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  siteKey: { type: String, required: true, unique: true },
  paid: { type: Boolean, default: false },
  tasks: { type: [ObjectId] },
  actions: {
    type: [
      {
        actionType: String,
        actionMessage: String,
        actionData: String
      }
    ]
  },
  linodeKey: { type: String, default: "NOT SET" },
  vultrKey: { type: String, default: "NOT SET" },
  digitalOceanKey: { type: String, default: "NOT SET" },
  awsKey: { type: String, default: "NOT SET" },
  googleKey: { type: String, default: "NOT SET" }
});

module.exports = mongoose.model("users", usersSchema);
