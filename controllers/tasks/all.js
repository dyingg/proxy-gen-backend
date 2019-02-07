var Tasks = require("../../models/tasks");
var Proxies = require("../../models/proxy");
var Users = require("../../models/users");

function all(req, res) {
  const userId = req.session.userId;
  Tasks.find({ userId })
    .sort({ timeStamp: -1 })
    .then(data => {
      if (data) {
        return res.json(data);
      } else {
        return res.json({ fail: "No data found" });
      }
    });
}

module.exports = all;
