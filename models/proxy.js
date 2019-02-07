const mongoose = require("mongoose");

var objectId = mongoose.Schema.ObjectId;

var ProxySchema = new mongoose.Schema({
  taskId: { type: objectId, required: true },
  taskName: { type: String, required: true },
  proxyString: { type: String },
  keyUsed: { type: String, required: true },
  vpsId: { type: String, required: true },
  provider: { type: String, required: true },
  location: { type: String, required: true },
  created: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("proxy", ProxySchema);
