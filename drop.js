const mongoose = require("mongoose");
const tasks = require("./models/tasks.js");
const proxies = require("./models/proxy.js");
const users = require("./models/users.js");

const actions = require("./models/actions.js");

mongoose
  .connect(
    "mongodb+srv://root:adminpass@cluster0-jiesw.mongodb.net/test?retryWrites=true",
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
