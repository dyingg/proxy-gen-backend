//const mongoose = require("mongoose");

const Tasks = require("./../../models/tasks.js");
const Proxies = require("./../../models/proxy.js");
const Users = require("./../../models/users.js");
const Actions = require("./../../models/actions");
// var id = process.argv[3];
// var UserId = process.argv[4];
const getDatabseLongHand = require("./../middleware/dblonghand.js");
var ProviderStratergy = require("../stratergy/handle.js");

// var aid = process.argv[2];
// var uid = process.argv[3];
//mongodb+srv://root:adminpass@cluster0-jiesw.mongodb.net/test?retryWrites=true
//task(aid, uid);

function task(id, UserId) {
  // mongoose
  //   .connect(
  //     "mongodb://145.239.7.113/earlybeta",
  //     { useNewUrlParser: true }
  //   )
  //   .then(() => {
  Users.findOne({
    _id: UserId
  }).then(curUser => {
    Tasks.findOne({ _id: id }).then(taskData => {
      var key = "";

      location = taskData.location;
      stratergyString = taskData.provider;
      key = curUser[getDatabseLongHand(stratergyString)];
      quantity = taskData.quantity;
      authUserName = taskData.authUserName;
      authPassword = taskData.authPassword;
      var DynamicStratergy = new ProviderStratergy(
        stratergyString,
        key,
        UserId
      );

      if (!DynamicStratergy.isMulti()) {
        DynamicStratergy.setLocation(location);
        DynamicStratergy.startup(authUserName, authPassword).then(() => {
          var ProxyTasks = [];
          for (var i = 0; i < parseInt(quantity); i++) {
            ProxyTasks.push(
              DynamicStratergy.makeProxy(authUserName, authPassword, taskData)
            );
          }

          Promise.all(ProxyTasks)
            .then(data => {
              Tasks.findOne({ _id: taskData._id }).then(mtaskData => {
                mtaskData.completed = true;
                mtaskData.success = true;
                mtaskData.failed = false;
                mtaskData.save().then(() => {
                  DynamicStratergy.cleanup().then(() => {
                    // process.exit(1);
                  });
                });
              });
            })
            .catch(err => {
              Tasks.findOne({ _id: taskData._id }).then(mtaskData => {
                mtaskData.completed = true;
                mtaskData.success = false;
                mtaskData.failed = true;
                mtaskData.save().then(() => {
                  DynamicStratergy.cleanup().then(() => {
                    //  process.exit(1);
                  });
                });
              });

              var action = new Actions({
                userId: UserId,
                actionType: 3,
                actionMessage: err
              });

              action.save();
            });
        });
      } else {
        DynamicStratergy.multiMakeProxy(
          authUserName,
          authPassword,
          location,
          quantity
        ).then(multiData => {
          var ips = Object.keys(multiData.publicIps);
          Promise.all(
            ips.map(ip => {
              var newProxy = new Proxies({
                proxyString:
                  ip + ":" + "3128" + ":" + authUserName + ":" + authPassword,
                keyUsed: key,
                taskId: taskData._id,
                provider: stratergyString,
                location: location,
                created: true,
                active: true,
                failed: false,
                vpsId: "not-needed",
                taskName: taskData.taskName
              });
              return newProxy.save();
            })
          ).then(() => {
            taskData.progressQuantity = taskData.quantity;
            taskData.completed = true;
            taskData.success = true;

            var action = "";
            if (multiData.error) {
              taskData.failed = true;
              var action = new Actions({
                userId: UserId,
                actionType: 3,
                actionMessage: multiData.error
              });
            } else {
              taskData.failed = false;
              var action = new Actions({
                userId: UserId,
                actionType: 1,
                actionMessage: "Task " + taskData.taskName + " succeded"
              });
            }
            taskData.guid = multiData.uuid;

            Promise.all([taskData.save(), action.save()])
              .then(() => {
                //  process.exit(1);
              })
              .catch(err => {
                console.log(err);
                // process.exit(1);
              });
          });
        });
      }

      //Stratergy String test here.
    });
  });
  // })
  // .catch(err => {
  //   console.log(err);
  //   // process.exit(1);
  // });
}

module.exports = task;
