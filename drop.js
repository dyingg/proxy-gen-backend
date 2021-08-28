const mongoose = require("mongoose");
const tasks = require("./models/tasks.js");
const proxies = require("./models/proxy.js");
const users = require("./models/users.js");

const actions = require("./models/actions.js");


//DROP UTILITY
mongoose
  .connect(
    "MONGO CONNECT URL HERE",
    { useNewUrlParser: true }
  )
  .then(() => {
    tasks.find({}).then(data => {
      data.forEach(k => k.delete());
    });
    proxies.find({}).then(data => {
      data.forEach(k => k.delete());
    });
    actions.find({}).then(data => {
      data.forEach(k => k.delete());
    });

    var newUser = users({
      username: "Dying",
      siteKey: "Dying"
    });
    newUser.save().then(console.log);
  });
