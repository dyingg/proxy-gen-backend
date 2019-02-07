// var taskID = process.argv[3];
// var userId = process.argv[2];

//const mongoose = require("mongoose");

const Tasks = require("./../../models/tasks.js");
const Proxies = require("./../../models/proxy.js");
const Users = require("./../../models/users.js");

// var id = process.argv[3];
// var UserId = process.argv[4];

var ProviderStratergy = require("../stratergy/handle.js");

const getDbLong = require("./../middleware/dblonghand.js");

// destroy();

function destroy(taskID, userId) {
  // mongoose
  //   .connect(
  //     "mongodb://145.239.7.113/earlybeta",
  //     { useNewUrlParser: true }
  //   )
  //   .then(() => {
  Users.findOne({ _id: userId }).then(user => {
    Tasks.findOne({ _id: taskID }).then(task => {
      if (task.userId == userId) {
        var key = "";
        key = user[getDbLong(task.provider)];

        var DynamicStratergy = new ProviderStratergy(
          task.provider,
          key,
          userId
        );
        var uid = task.guid;
        var loc = task.location;
        task.delete();

        if (!DynamicStratergy.isMulti()) {
          Proxies.find({ taskId: taskID }).then(data => {
            var vpsIds = [];
            data.forEach(p => {
              vpsIds.push(p.vpsId);
            });
            console.log(vpsIds);
            Promise.all(vpsIds.map(vid => DynamicStratergy.destroy(vid)))
              .then(() => {
                //  process.exit(1);
              })
              .catch(console.log);
          });
        } else {
          DynamicStratergy.multiDelete(uid, loc)
            .then(() => {
              console.log("Deleting");
              //  process.exit(1);
            })
            .catch(err => {
              console.log(err);
              // process.exit(1);
            });
        }
      }
    });
  });
  //  });
}

module.exports = destroy;
